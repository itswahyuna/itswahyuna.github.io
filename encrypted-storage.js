(() => {
    const databaseName = 'wahyuna-encrypted-storage';
    const keyStoreName = 'keys';
    const encryptionKeyName = 'local-storage';
    const encryptedValuePrefix = 'enc:v1:';
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    let writeQueue = Promise.resolve();

    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(keyStoreName);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('error 1'));
        });
    }

    function readStoredKey(database) {
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(keyStoreName, 'readonly');
            const request = transaction.objectStore(keyStoreName).get(encryptionKeyName);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error || new Error('error 2'));
            transaction.onabort = () => reject(transaction.error || new Error('error 3'));
        });
    }

    function storeKey(database, key) {
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(keyStoreName, 'readwrite');
            transaction.objectStore(keyStoreName).add(key, encryptionKeyName);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('error 4'));
            transaction.onabort = () => reject(transaction.error || new Error('error 5'));
        });
    }

    function encodeBase64(bytes) {
        let binary = '';
        for (let index = 0; index < bytes.length; index += 1) {
            binary += String.fromCharCode(bytes[index]);
        }
        return btoa(binary);
    }

    function decodeBase64(value) {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    }

    async function encryptValue(key, value) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            textEncoder.encode(value)
        );
        return encryptedValuePrefix + JSON.stringify({
            iv: encodeBase64(iv),
            ciphertext: encodeBase64(new Uint8Array(ciphertext))
        });
    }

    async function decryptValue(key, value) {
        let payload;
        try {
            payload = JSON.parse(value.slice(encryptedValuePrefix.length));
        } catch (error) {
            throw new Error('error 6', { cause: error });
        }

        if (typeof payload?.iv !== 'string' || typeof payload?.ciphertext !== 'string') {
            throw new Error('error 7');
        }

        try {
            const plaintext = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: decodeBase64(payload.iv) },
                key,
                decodeBase64(payload.ciphertext)
            );
            return textDecoder.decode(plaintext);
        } catch (error) {
            throw new Error('error 8', { cause: error });
        }
    }

    async function createKey(database) {
        const existingKey = await readStoredKey(database);
        if (existingKey) return existingKey;

        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
        try {
            await storeKey(database, key);
            return key;
        } catch (error) {
            const storedKey = await readStoredKey(database);
            if (storedKey) return storedKey;
            throw error;
        }
    }

    function isEncryptedValue(value) {
        if (!value.startsWith(encryptedValuePrefix)) return false;
        try {
            const payload = JSON.parse(value.slice(encryptedValuePrefix.length));
            return typeof payload?.iv === 'string' && typeof payload?.ciphertext === 'string';
        } catch {
            return false;
        }
    }

    async function migrateLocalStorage(key) {
        const storageKeys = Array.from(
            { length: localStorage.length },
            (_, index) => localStorage.key(index)
        ).filter(storageKey => storageKey !== null);

        for (const storageKey of storageKeys) {
            const value = localStorage.getItem(storageKey);
            if (value === null || isEncryptedValue(value)) continue;
            localStorage.setItem(storageKey, await encryptValue(key, value));
        }
    }

    const initialization = (async () => {
        if (!globalThis.crypto?.subtle || !globalThis.indexedDB) {
            throw new Error('error 9');
        }

        const database = await openDatabase();
        const initializeKey = () => createKey(database);
        const key = navigator.locks
            ? await navigator.locks.request(`${databaseName}-key`, initializeKey)
            : await initializeKey();

        await migrateLocalStorage(key);
        return { database, key };
    })();

    const api = {
        ready: initialization.then(() => undefined),

        async getItem(storageKey) {
            if (typeof storageKey !== 'string') {
                throw new TypeError('error 10');
            }

            const { key } = await initialization;
            const value = localStorage.getItem(storageKey);
            if (value === null) return null;
            if (!isEncryptedValue(value)) {
                throw new Error('error 11');
            }
            return decryptValue(key, value);
        },

        async setItem(storageKey, value) {
            if (typeof storageKey !== 'string' || typeof value !== 'string') {
                throw new TypeError('error 12');
            }

            const { key } = await initialization;
            const write = writeQueue.then(async () => {
                localStorage.setItem(storageKey, await encryptValue(key, value));
            });
            writeQueue = write.catch(() => undefined);
            await write;
        },

        async removeItem(storageKey) {
            if (typeof storageKey !== 'string') {
                throw new TypeError('error 13');
            }

            await initialization;
            const write = writeQueue.then(() => {
                localStorage.removeItem(storageKey);
            });
            writeQueue = write.catch(() => undefined);
            await write;
        }
    };

    api.ready.catch(error => {
        console.error(error);
    });
    window.encryptedStorage = api;
})();

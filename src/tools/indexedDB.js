import { DEBUG, CONFIG, CACHE, } from '../config/config';
const STORE_NAME = 'game';
export function initIDB({success,error,callback}){
    let request = window.indexedDB.open(CACHE.save1, 1);
    request.onerror = event =>{
        error&&error(event);
        callback&&callback(event);
    }
    request.onsuccess = event =>{
        window.idb = request.result;
        success&&success(event);
        callback&&callback(event);
    }
    request.onupgradeneeded = event =>{
        window.idb = event.target.result;
        let gameStore;
        if(!window.idb.objectStoreNames.contains(STORE_NAME)){
            gameStore = window.idb.createObjectStore(STORE_NAME, {
                keyPath: 'id',
                autoIncrement: true,
            });
        }
    }
}
export function addIDB({game,success,error,callback}){
    if(!window.idb) return;
    let request = window.idb.transaction([STORE_NAME], 'readwrite')
        .objectStore(STORE_NAME)
        .add({
            id: 1,
            game,
        });
    request.onsuccess = event =>{
        success&&success(event);
        callback&&callback(event);
    }
    request.onerror = event =>{
        error&&error(event);
        callback&&callback(event);
    }
    request.onabort = event =>{
        error&&error(event);
        callback&&callback(event);
    }
}
export function updateIDB({game,success,error,callback}){
    if(!window.idb) return;
    let request = window.idb.transaction([STORE_NAME],'readwrite')
        .objectStore(STORE_NAME)
        .put({
            id: 1,
            game,
        });
    request.onsuccess = event =>{
        success&&success(event);
        callback&&callback(event);
    }
    request.onerror = event =>{
        error&&error(event);
        callback&&callback(event);
    }
    request.onabort = event =>{
        error&&error(event);
        callback&&callback(event);
    }
}
export function readIDB({success,error,callback}){
    if(!window.idb) return;
    let transaction = window.idb.transaction([STORE_NAME]);
    let objectStore = transaction.objectStore(STORE_NAME);
    let request = objectStore.get(1);
    request.onsuccess = event =>{
        if(request.result){
            success&&success(request.result.game);
            callback&&callback(request.result);
        }
        else{
            error&&error(event);
            callback&&callback(event);
        }
    };
    request.onerror = event =>{
        error&&error(event);
        callback&&callback(event);
    };
}
export function deleteIDB({success,error,callback}){
    if(!window.idb) return;
    var request = window.idb.transaction([STORE_NAME],'readwrite')
        .objectStore(STORE_NAME)
        .delete(1);
    request.onsuccess = event =>{
        success&&success(event);
        callback&&callback(event);
    };
    request.onerror = event =>{
        error&&error(event);
        callback&&callback(event);
    };
}
export function closeIDB(){
    window.idb.close();
}



























//

import request from "umi-request";

export async function getAppList() {
    return request('/api/master/list', {
        method: 'GET'
    })
}

export async function getNamespaceList(appId: string) {
    return request('/api/namespace/' + appId, {
        method: 'GET'
    })
}

export async function getFieldListByNamespaceId(namespaceId: string) {
    return request('/api/field/' + namespaceId, {
        method: 'GET'
    })
}

export async function getFieldList(appId: string) {
    return request('/api/field/list', {
        method: 'GET',
        params: {
            'appId': appId
        }
    })
}

export async function getFieldValue(fieldId: string) {
    return request('/api/field/' + fieldId, {
        method: 'GET'
    })
}

export async function getCategoryList() {
    return request('/api/master/categories', {
        method: 'GET'
    })
}
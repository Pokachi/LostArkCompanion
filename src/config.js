export const appConfig = {
    // MODULE 1- BACKEND
    initStateAPI: '', // e.g. https://12abcdef89.execute-api.us-west-2.amazonaws.com/Prod/InitState/
    // MODULE 2 - REALTIME
    iot: {
        poolId: '', // e.g. 'us-west-2:1abcdef-1234-abcd-1234-abcde123456'
        host: '', // e.g. 'ab12ab12abcde.iot.us-east-1.amazonaws.com'
        region: '' // e.g. 'us-west-1'
    },
    // MODULE 3 - PHOTOS
    photoUploadURL: '', // e.g. https://12abcdfg89.execute-api.us-west-2.amazonaws.com/Prod/Upload
    //
    // Don't modify anything below this comment!
    //
    images: {
        logoURL: 'https://d15l97sovqpx31.cloudfront.net/images/theme-park-logo-150.png'
    }
}

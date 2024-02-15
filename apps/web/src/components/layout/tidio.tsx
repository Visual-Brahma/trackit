"use client"

interface TidioIdentify {
    distinct_id?: string;
    email?: string;
    name?: string;
    phone?: string;
};

export const TidioUserInfo=(userInfo: TidioIdentify) => {

    (window.document as Document&{ tidioIdentify: TidioIdentify }).tidioIdentify=userInfo;
    return (
        <>
            {
                // empty fragment
            }
        </>
    );
}

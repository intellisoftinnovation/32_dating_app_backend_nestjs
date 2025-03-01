
import { envs } from "src/config";

export enum FacePlusVerifyCode {
    SUCCESS = "success",
    TRY_AGAIN_LATER = "try_again_later",
    NO_FACE = "no_face",
    MULTIPLE_FACES = "multiple_faces",
    GENDER_MISMATCH = "gender_mismatch"
}

export const facePlusGenderVerify = async (gender: string, img_url: string) => {
    const tempForm = new FormData();
    tempForm.append('api_key', envs.FACEPLUS_KEY);
    tempForm.append('api_secret', envs.FACEPLUS_SECRET);
    tempForm.append('return_attributes', 'gender');
    tempForm.append('image_url', img_url);

    try {
        const res = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
            method: 'POST',
            body: tempForm
        });

        const data = await res.json();

        if (!res.ok) {
            return { verified: false, code: FacePlusVerifyCode.TRY_AGAIN_LATER, details: { ...data, img_url, gender, status: res.status } };
        }

        if (data.face_num === 0) {
            return { verified: false, code: FacePlusVerifyCode.NO_FACE, details: { ...data, img_url, gender, status: res.status } };
        }

        if (data.face_num > 1) {
            return { verified: false, code: FacePlusVerifyCode.MULTIPLE_FACES , details: { ...data, img_url, gender, status: res.status } };
        }

        if (data.face_num === 1) {
            const api_gender = data.faces[0].attributes.gender.value;
            if (api_gender.toLowerCase() === gender.toLowerCase()) {
                return { verified: true, code: FacePlusVerifyCode.SUCCESS, details: { ...data, img_url, gender, status: res.status } };
            } else {
                return { verified: false, code: FacePlusVerifyCode.GENDER_MISMATCH, details: { ...data, img_url, gender, status: res.status } };
            }
        }

        return { verified: false, code: FacePlusVerifyCode.TRY_AGAIN_LATER, details: { data, img_url, gender } };

    } catch (err) {        

        return { verified: false, code: FacePlusVerifyCode.TRY_AGAIN_LATER, details: { error: err, img_url, gender } };
        
    }
};


import { envs } from "src/config";
export enum FacePlusPictureVerifyCode {
    FACE_OUT = "face_out",
    SUCCESS = "success",
    TRY_AGAIN_LATER = "try_again_later",
    NO_FACE = "no_face",
    MULTIPLE_FACES = "multiple_faces",
    FACE_NOT_IN_RECTANGLE = "face_not_in_rectangle",
}

export const facePlusPictureVerifyBeta = async (face_rectangle: string, file: Express.Multer.File) => {
    const tempForm = new FormData();
    tempForm.append('api_key', envs.FACEPLUS_KEY);
    tempForm.append('api_secret', envs.FACEPLUS_SECRET);
    const base64Image = file.buffer.toString('base64');
    tempForm.append('image_base64', base64Image);
    // tempForm.append('face_rectangle', face_rectangle);

    try {
        const res = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
            method: 'POST',
            body: tempForm
        });

        const data = await res.json();

        if (!res.ok) {
            return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { ...data, status: res.status } };
        }

        if (data.face_num === 0) {
            return { valid: false, code: FacePlusPictureVerifyCode.NO_FACE, details: { ...data, status: res.status } };
        }

        if (data.face_num > 1) {
            return { valid: false, code: FacePlusPictureVerifyCode.MULTIPLE_FACES, details: { ...data, status: res.status } };
        }

        if (data.face_num === 1) {
            const faceRectangle = data.faces[0].face_rectangle;  // Rectángulo de la cara detectada


            if (!isFaceInsideRectangle(faceRectangle, face_rectangle)) {
                return { valid: false, code: FacePlusPictureVerifyCode.FACE_NOT_IN_RECTANGLE, details: { ...data, status: res.status } };
            }

            return { valid: true, code: FacePlusPictureVerifyCode.SUCCESS, details: { ...data, status: res.status } };
        }



        return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { data } };

    } catch (err) {

        return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { error: err } };

    }
};

export const facePlusPictureVerifyPro = async (face_rectangle: string, file: Express.Multer.File) => {
    const tempForm = new FormData();
    tempForm.append('api_key', envs.FACEPLUS_KEY);
    tempForm.append('api_secret', envs.FACEPLUS_SECRET);
    const base64Image = file.buffer.toString('base64');
    tempForm.append('image_base64', base64Image);
    tempForm.append('face_rectangle', face_rectangle);

    try {
        const res = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
            method: 'POST',
            body: tempForm
        });

        const data = await res.json();

        if (!res.ok) {
            return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { ...data, status: res.status } };
        }

        if (data.face_num === 0) {
            return { valid: false, code: FacePlusPictureVerifyCode.NO_FACE, details: { ...data, status: res.status } };
        }

        if (data.face_num > 1) {
            return { valid: false, code: FacePlusPictureVerifyCode.MULTIPLE_FACES, details: { ...data, status: res.status } };
        }

        if (data.face_num === 1) {
            return { valid: true, code: FacePlusPictureVerifyCode.SUCCESS, details: { ...data, status: res.status } };
        }
        return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { data } };

    } catch (err) {

        return { valid: false, code: FacePlusPictureVerifyCode.TRY_AGAIN_LATER, details: { error: err } };

    }
};



const isFaceInsideRectangle = (face_rect: any, param_rect: string) => {
    const face = face_rect;
    const param = JSON.parse(param_rect);

    return (
        face.top >= param.top &&
        face.left >= param.left &&
        face.top + face.height <= param.top + param.height &&
        face.left + face.width <= param.left + param.width
    );
};
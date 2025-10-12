import { ImagePickerAsset } from "expo-image-picker";
import { api } from "@/core/api/api";
import { UploadImageFile } from "../interfaces/upload-image.interface";

export const uploadImage = async (
  image: ImagePickerAsset
): Promise<UploadImageFile> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formdata = new FormData() as any;
  formdata.append("file", {
    uri: image.uri,
    name: image.fileName || "photo.jpg",
    type: "image/jpeg",
  });

  const { data } = await api.post<UploadImageFile>(
    "files/upload-image",
    formdata
  );

  return data;
};

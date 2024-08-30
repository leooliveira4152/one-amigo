import { faker } from "@faker-js/faker";
import { renderHook, waitFor } from "@testing-library/react";
import { getDownloadURL, ref, StorageReference } from "firebase/storage";
import useImage from "use-image";

import { useGetStorageImage } from "./useGetStorageImage";
import { storage } from "../storage";

jest.mock("firebase/storage");
jest.mock("use-image");
jest.mock("../storage");

describe("useGetStorageImage", () => {
  const mockImageUrl = faker.internet.url();
  const mockImagePath = faker.system.directoryPath();
  const mockStorageRef = {} as StorageReference;

  jest.mocked(useImage).mockReturnValue([undefined, "loaded"]);
  jest.mocked(ref).mockReturnValue(mockStorageRef);
  jest.mocked(getDownloadURL).mockResolvedValue(mockImageUrl);

  it("should run past every function accordingly, in one cycle", async () => {
    const { result, rerender } = renderHook(() =>
      useGetStorageImage(mockImagePath)
    );

    expect(useImage).toHaveBeenCalledWith("");

    await waitFor(() => expect(result.current.imageObject).not.toBeUndefined());
    expect(ref).toHaveBeenCalledWith(storage, mockImagePath);
    expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);

    const imageObject = result.current.imageObject;
    expect(imageObject?.onload).toBeDefined();
    if (!imageObject || !imageObject.onload) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = {};
    const imageSize = 300;
    imageObject.width = imageSize;
    imageObject.height = imageSize;
    imageObject?.onload(event);

    rerender();

    expect(result.current.dimensions).toStrictEqual({
      width: imageSize,
      height: imageSize,
    });
    expect(useImage).toHaveBeenCalledWith(mockImageUrl);
  });
});

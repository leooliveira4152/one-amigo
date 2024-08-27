import { faker } from "@faker-js/faker";
import { fireEvent, render, within } from "@testing-library/react";

import { useDialogStore } from "@/features/store/dialog";

import { Dialog, DialogIds } from "./Dialog";

const mockContent = faker.lorem.sentence();
const mockTitle = faker.lorem.sentence();

const mockDialogStore = {
  open: true,
  content: { title: mockTitle, content: mockContent },
  openDialog: jest.fn(),
  closeDialog: jest.fn(),
  clearDialogContent: jest.fn(),
};

jest.mock("@/features/store/dialog", () => ({
  useDialogStore: jest.fn(() => mockDialogStore),
}));

describe("<Dialog />", () => {
  const setup = () => render(<Dialog />);

  describe("root component rendering", () => {
    it("should render the dialog itself", () => {
      const { getByTestId } = setup();
      getByTestId(DialogIds.ROOT);
    });

    it("should NOT render the dialog if dialogStore open param is false", () => {
      jest
        .mocked(useDialogStore)
        .mockReturnValueOnce({ ...mockDialogStore, open: false });

      const { queryByTestId } = setup();
      expect(queryByTestId(DialogIds.ROOT)).toBeFalsy();
    });
  });

  it("should call the closeDialog function when dialog is closed", () => {
    const { getAllByRole } = setup();
    const element = getAllByRole("presentation")[0].firstChild;

    if (element) {
      fireEvent.click(element);
      expect(mockDialogStore.closeDialog).toHaveBeenCalled();
    } else fail();
  });

  describe("text rendering", () => {
    it("should properly display the title and content", () => {
      const { getByTestId } = setup();
      const { getByText: getTitleByText } = within(
        getByTestId(DialogIds.TITLE)
      );
      const { getByText: getContentByText } = within(
        getByTestId(DialogIds.CONTENT)
      );

      getTitleByText(mockTitle);
      getContentByText(mockContent);
    });

    it("should NOT render the title if no title is passed", () => {
      jest
        .mocked(useDialogStore)
        .mockReturnValueOnce({ ...mockDialogStore, content: {} });

      const { queryByTestId } = setup();
      expect(queryByTestId(DialogIds.TITLE)).toBeFalsy();
    });
  });
});

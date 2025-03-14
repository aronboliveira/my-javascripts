import { mount } from "@vue/test-utils";
//@ts-ignore
import FilterCheck from "../../FilterCheck.vue";
describe("FilterCheck.vue", () => {
  it("renders correctly with default props", () => {
    const wrapper = mount(FilterCheck, {
      props: {
        id: "check1",
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props().id).toBe("check1");
  });
  it("updates checked value on change", async () => {
    const wrapper = mount(FilterCheck, {
      props: {
        id: "check2",
        checked: false,
      },
    });
    const inputElement = wrapper.find("input");
    await inputElement.setValue(true);
    expect(inputElement.element.checked).toBe(true);
  });
  it("calls handleSubmit on change", async () => {
    const handleSubmitMock = jest.fn();
    jest.mock("../../../../scripts/handlers/handlersIO", () => ({
      handleSubmit: handleSubmitMock,
    }));
    const wrapper = mount(FilterCheck, {
      props: {
        id: "check3",
      },
    });
    await wrapper.find("input").trigger("change");
    expect(handleSubmitMock).toHaveBeenCalled();
    jest.unmock("../../../../scripts/handlers/handlersIO");
  });
  it("handles label correctly", () => {
    const wrapper = mount(FilterCheck, {
      props: {
        id: "check4",
        lab: "Accept Terms",
      },
    });
    expect(wrapper.find("label").text()).toBe("Accept Terms");
  });
});

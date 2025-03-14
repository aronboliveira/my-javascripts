import { mount } from "@vue/test-utils";
//@ts-ignore
import FilterInp from "../../FilterInp.vue";
describe("FilterInp.vue", () => {
  it("renders correctly with default props", () => {
    const wrapper = mount(FilterInp, {
      props: {
        id: "inp1",
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props().id).toBe("inp1");
  });
  it("updates value and datalist on input", async () => {
    const wrapper = mount(FilterInp, {
      props: {
        id: "inp2",
        dataList: ["apple", "banana", "cherry"],
      },
    });
    await wrapper.find("input").setValue("app");
    expect(wrapper.vm.s.v).toBe("app");
    expect(wrapper.findAll("datalist option").length).toBeGreaterThan(0);
  });
  it("calls handleSubmit on change", async () => {
    const handleSubmitMock = jest.fn();
    jest.mock("../../../../scripts/handlers/handlersIO", () => ({
      handleSubmit: handleSubmitMock,
    }));
    const wrapper = mount(FilterInp, {
      props: {
        id: "inp3",
      },
    });
    await wrapper.find("input").trigger("change");
    expect(handleSubmitMock).toHaveBeenCalled();
    jest.unmock("../../../../scripts/handlers/handlersIO");
  });
  it("handles pattern validation correctly", async () => {
    const wrapper = mount(FilterInp, {
      props: {
        id: "inp4",
        pattern: "^\\d+$",
      },
    });
    const inputElement = wrapper.find("input");
    await inputElement.setValue("abc");
    expect(inputElement.element.validity.valid).toBe(false);
    await inputElement.setValue("123");
    expect(inputElement.element.validity.valid).toBe(true);
  });
});

import { mount } from "@vue/test-utils";
//@ts-ignore
import FilterNum from "../../components/FilterNum.vue";
describe("FilterNum.vue", () => {
  it("renders correctly with default props", () => {
    const wrapper = mount(FilterNum, {
      props: {
        id: "num1",
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props().id).toBe("num1");
  });
  it("sanitizes and updates value correctly", async () => {
    const wrapper = mount(FilterNum, {
      props: {
        id: "num2",
      },
    });
    await wrapper.find("input").setValue("123abc");
    expect(wrapper.vm.s.v).toBe("123");
  });
  it("updates datalist on value change", async () => {
    const wrapper = mount(FilterNum, {
      props: {
        id: "num3",
        dataList: ["100", "200", "300"],
      },
    });
    await wrapper.find("input").setValue("150");
    expect(wrapper.findAll("datalist option").length).toBeGreaterThan(0);
  });
  it("calls handleSubmit on change", async () => {
    const handleSubmitMock = jest.fn();
    jest.mock("../../../../scripts/handlers/handlersIO", () => ({
      handleSubmit: handleSubmitMock,
    }));
    const wrapper = mount(FilterNum, {
      props: {
        id: "num4",
      },
    });
    const inputElement = wrapper.find("input");
    await inputElement.trigger("change");
    expect(handleSubmitMock).toHaveBeenCalled();
    jest.unmock("../../../../scripts/handlers/handlersIO");
  });
});

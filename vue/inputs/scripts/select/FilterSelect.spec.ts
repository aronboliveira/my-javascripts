import { mount } from "@vue/test-utils";
//@ts-ignore
import FilterSelect from "../../FilterSelect.vue";
import { OptProps } from "../../../../scripts/declarations/interfaceComponents";
describe("FilterSelect.vue", () => {
  const options: OptProps[] = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" },
  ];
  it("renders correctly with options", () => {
    const wrapper = mount(FilterSelect, {
      props: {
        id: "select1",
        opts: options,
      },
    });
    expect(wrapper.exists()).toBe(true);
    const selectElement = wrapper.find("select");
    expect(selectElement.exists()).toBe(true);
    expect(selectElement.findAll("option").length).toBe(2);
  });
  it("updates modelValue on selection", async () => {
    const wrapper = mount(FilterSelect, {
      props: {
        id: "select2",
        opts: options,
        mv: "option1",
      },
    });
    await wrapper.find("select").setValue("option2");
    expect(wrapper.emitted("update:mv")).toBeTruthy();
    expect(wrapper.emitted("update:mv")?.[0]).toEqual(["option2"]);
  });
  it("handles multiple selection", async () => {
    const wrapper = mount(FilterSelect, {
      props: {
        id: "select3",
        opts: options,
        type: "select-multiple",
        mv: [],
      },
    });
    const selectElement = wrapper.find("select");
    (selectElement.element as HTMLSelectElement).options[0].selected = true;
    (selectElement.element as HTMLSelectElement).options[1].selected = true;
    await selectElement.trigger("change");
    expect(wrapper.emitted("update:mv")).toBeTruthy();
    expect(wrapper.emitted("update:mv")?.[0]).toEqual([["option1", "option2"]]);
  });
  it("calls handleSubmit on change", async () => {
    const handleSubmitMock = jest.fn();
    jest.mock("../../../../scripts/handlers/handlersIO", () => ({
      handleSubmit: handleSubmitMock,
    }));
    const wrapper = mount(FilterSelect, {
      props: {
        id: "select4",
        opts: options,
      },
    });
    await wrapper.find("select").trigger("change");
    expect(handleSubmitMock).toHaveBeenCalled();
    jest.unmock("../../../../scripts/handlers/handlersIO");
  });
});

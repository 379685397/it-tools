import { beforeEach, describe, expect, it } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import _ from 'lodash';
import CInputText from './c-input-text.vue';
import { useValidation } from '@/composable/validation';
import { i18nPlugin } from '@/plugins/i18n.plugin';

const global = { plugins: [i18nPlugin] };

describe('CInputText', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Renders a label', () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        label: 'Label',
      },
    });

    expect(wrapper.get('.label').text()).to.equal('Label');
  });

  it('Renders a placeholder', () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        placeholder: 'Placeholder',
      },
    });

    expect(wrapper.get('.input').attributes('placeholder')).to.equal('Placeholder');
  });

  it('Renders a value', () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        value: 'Value',
      },
    });

    expect(wrapper.vm.value).to.equal('Value');
  });

  it('Renders a provided id', () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        id: 'id',
      },
    });

    expect(wrapper.get('.input').attributes('id')).to.equal('id');
  });

  it('updates value on input', async () => {
    const wrapper = shallowMount(CInputText, { global });

    await wrapper.get('input').setValue('Hello');

    expect(_.get(wrapper.emitted(), 'update:value.0.0')).to.equal('Hello');
  });

  it('cannot be edited when disabled', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        disabled: true,
      },
    });

    await wrapper.get('input').setValue('Hello');

    expect(_.get(wrapper.emitted(), 'update:value')).toBeUndefined();
  });

  it('renders a feedback message for invalid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: { validationRules: [{ validator: () => false, message: 'Message' }] },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Message');
  });

  it('if the value become valid according to rules, the feedback disappear', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        validationRules: [{ validator: (value: string) => value === 'Hello', message: 'Value should be Hello' }],
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Value should be Hello');

    await wrapper.setProps({ value: 'Hello' });

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('feedback does not render for valid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: { validationRules: [{ validator: () => true, message: 'Message' }] },
    });

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('renders a feedback message for invalid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => false, message: 'Message' }] }),
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Message');
  });

  it('feedback does not render for valid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => true, message: 'Message' }] }),
      },
    });
    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('if the value become valid according to the custom validation wrapper, the feedback disappear', async () => {
    const source = ref('');

    const wrapper = shallowMount(CInputText, {
      global,
      props: {
        validation: useValidation({
          source,
          rules: [{ validator: (value: string) => value === 'Hello', message: 'Value should be Hello' }],
        }),
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Value should be Hello');

    source.value = 'Hello';

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('[prop:testId] renders a test id on the input', async () => {
    const wrapper = mount(CInputText, {
      global,
      props: {
        testId: 'TEST',
      },
    });

    expect(wrapper.get('input').attributes('data-test-id')).to.equal('TEST');
  });
});

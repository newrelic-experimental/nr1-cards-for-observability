import React from 'react';
import { shallow, mount } from 'enzyme';

import Modal from './modal';

describe('<Modal />', () => {
  describe('with no props', () => {
    test('renders a modal', () => {
      const wrapper = shallow(<Modal />);
      expect(wrapper.find('.modal-window')).toHaveLength(1);
    });
  });

  describe('with onClose prop', () => {
    test.skip('onClose fn gets called', () => {
      const mockOnClose = jest.fn();
      const wrapper = shallow(<Modal onClose={mockOnClose} />);
      wrapper.find('button').simulate('click');
      expect(mockOnClose.mock.calls.length).toBe(1);
    });
  });
});

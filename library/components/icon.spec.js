import React from 'react';
import { shallow } from 'enzyme';

import Icon from './icon';

describe('<Icon />', () => {
  describe('with no props', () => {
    test('should return null', () => {
      const wrapper = shallow(<Icon />);
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('with type prop', () => {
    const wrapper = shallow(<Icon type="plus" />);
    test('should return a span with class `icon`', () => {
      expect(wrapper.find('.icon')).toHaveLength(1);
    });

    test('should return an icon svg', () => {
      const svg = wrapper.find('svg');
      expect(svg.children()).toHaveLength(1);
    });
  });

  describe('with type and size props', () => {
    const wrapper = shallow(<Icon type="plus" size="large" />);
    test('should return a span with class `large`', () => {
      expect(wrapper.find('.icon').hasClass('large')).toBe(true);
    });
  });

  describe('with type, size and color props', () => {
    const wrapper = shallow(<Icon type="plus" size="large" color="white" />);
    test('icon should have a style with `fill`', () => {
      expect(wrapper.find('svg').prop('style')).toHaveProperty('fill', 'white');
    });
  });
});

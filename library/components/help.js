import React from 'react';

import marked from 'marked';

import { getUrl } from '../utils/data';

export default class Help extends React.Component {
  state = {
    doc: '',
  };

  rootUrl = 'https://raw.githubusercontent.com/amit-y/cfo-docs/master/';

  componentDidMount() {
    document
      .querySelector('.markdown-body')
      .addEventListener('click', this.captureClicks, false);
    this.getDoc('README.md');
  }

  componentWillUnmount() {
    document
      .querySelector('.markdown-body')
      .removeEventListener('click', this.captureClicks, false);
  }

  getDoc = async path => {
    const text = await getUrl(path, 'text', this.rootUrl);
    this.setState({ doc: marked(text) });
  };

  captureClicks = e => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target) {
      const href = target.getAttribute('href');
      if (href) window.open(href, '_blank');
    }
  };

  render() {
    const { doc } = this.state;
    return (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: doc }}
      />
    );
  }
}

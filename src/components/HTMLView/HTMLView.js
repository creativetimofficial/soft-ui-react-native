import React, {PureComponent} from 'react';
import htmlToElement from './htmlToElement';
import {Linking, StyleSheet, Text} from 'react-native';

export default class HTMLView extends PureComponent {
  // static defaultProps = {
  //   onLinkPress: this.openURL,
  //   onError: console.error.bind(console),
  // };

  state = {
    element: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value);
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.startHtmlRender(this.props.value);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  openURL(url) {
    // console.log('url', url)
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  startHtmlRender(value) {
    if (!value) return this.setState({element: null});

    const opts = {
      linkHandler: this.openURL,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    };

    htmlToElement(value, opts, (err, element) => {
      if (err) return this.props.onError(err);

      if (this.mounted) this.setState({element});
    });
  }

  render() {
    if (this.state.element) {
      return (
        <Text style={this.props.stylesheet} children={this.state.element} />
      );
    }
    return <Text />;
  }
}

const defaultStyle = {margin: 0, padding: 0};
const boldStyle = {fontWeight: 'bold'};
const italicStyle = {fontStyle: 'italic'};
const codeStyle = {};

//noinspection Eslint
const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  p: defaultStyle,
  span: defaultStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
});

module.exports = HTMLView;
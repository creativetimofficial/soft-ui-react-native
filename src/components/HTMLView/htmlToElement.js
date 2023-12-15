import React from 'react';
import {Text, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

import htmlparser from './vendor/htmlparser2';
import entities from './vendor/entities';
import Image from './helper/Image';

const LINE_BREAK = '\n';
const PARAGRAPH_BREAK = '\n';
const BULLET = '\u2022 ';

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null;

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        const rendered = opts.customRenderer(node, index, list);
        if (rendered || rendered === null) return rendered;
      }

      if (node.type === 'text') {
        return (
          <Text key={index} style={parent ? opts.styles[parent.name] : null}>
            {entities.decodeHTML(node.data)}
          </Text>
        );
      }

      if (node.type === 'tag') {
        if (node.name === 'img') {
          const img_w =
            +node.attribs['width'] || +node.attribs['data-width'] || width - 20;
          const img_h =
            +node.attribs['height'] ||
            +node.attribs['data-height'] ||
            width - 20;

          const img_style = {
            width: img_w,
            height: img_h,
          };
          const source = {
            uri: node.attribs.src,
            width: img_w,
            height: img_h,
          };
          return <Image key={index} source={source} style={img_style} />;
        }

        let linkPressHandler = null;
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () =>
            opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        return (
          <Text key={index} onPress={linkPressHandler} style={{}}>
            {node.name == 'pre' ? LINE_BREAK : null}
            {node.name == 'li' ? BULLET : null}
            {domToElement(node.children, node)}
            {node.name == 'br' || node.name == 'li' ? LINE_BREAK : null}
            {node.name == 'p' && index < list.length - 1
              ? PARAGRAPH_BREAK
              : null}
            {node.name == 'h1' ||
            node.name == 'h2' ||
            node.name == 'h3' ||
            node.name == 'h4' ||
            node.name == 'h5'
              ? PARAGRAPH_BREAK
              : null}
          </Text>
        );
      }
    });
  }

  const handler = new htmlparser.DomHandler(function (err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}

module.exports = htmlToElement;

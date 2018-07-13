import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Editor } from 'slate-react';
import { Value , Change } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import Prism from 'prismjs'
import Plain from 'slate-plain-serializer';

import './RichEditor.scss';

// 当前富文本组件使用了 Slate 详细文档请参见 https://docs.slatejs.org/

const DEFAULT_NODE = 'paragraph';
const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');
const value = require('./slate/images/value.json');

function unwrapLink(change) {
  change.unwrapInline('link')
}
function wrapLink(change, href) {
  change.wrapInline({
    type: 'link',
    data: { href },
  })

  change.collapseToEnd()
}

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(event) {
    editor.change(c =>
      c.setNodeByKey(node.key, { data: { language: event.target.value } })
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code {...props.attributes}>{props.children}</code>
      </pre>
      <div
        contentEditable={false}
        style={{ position: 'absolute', top: '5px', right: '5px' }}
      >
        <select value={language} onChange={onChange}>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  )
}

function CodeBlockLine(props) {
  return <div {...props.attributes}>{props.children}</div>
}

export default class RichEditor extends Component {
  static displayName = 'RichEditor';

  constructor(props) {
    super(props);

    // 加载初始数据，通常从接口中获取或者默认为空
    this.state = {
      // value:Value.fromJSON(value)
      value: props.value ? Value.fromJSON(props.value) : Plain.deserialize(''),
    };
  }

  hasMark = (type) => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  onChange = ({ value }) => {
    this.setState({ value });
    // 如果上层有传递 onChange 回调，则应该传递上去
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(value.toJSON());
    }
  };

  getType = chars => {
    switch (chars) {
      case '*':
      case '-':
      case '+':
        return 'list-item'
      case '>':
        return 'block-quote'
      case '#':
        return 'heading-one'
      case '##':
        return 'heading-two'
      case '###':
        return 'heading-three'
      case '####':
        return 'heading-four'
      case '#####':
        return 'heading-five'
      case '######':
        return 'heading-six'
      default:
        return null
    }
  }

  onSpace = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return

    const { startBlock, startOffset } = value
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
    const type = this.getType(chars)

    if (!type) return
    if (type == 'list-item' && startBlock.type == 'list-item') return
    event.preventDefault()
    console.log(change, 'Change')
    change.setBlock(type)

    if (type == 'list-item') {
      change.wrapBlock('bulleted-list')
    }

    change.extendToStartOf(startBlock).delete()
    return true
  }

  onBackspace = (event, change) => {
    const { value } = change
    if (value.isExpanded) return
    if (value.startOffset != 0) return

    const { startBlock } = value
    if (startBlock.type == 'paragraph') return

    event.preventDefault()
    change.setBlock('paragraph')

    if (startBlock.type == 'list-item') {
      change.unwrapBlock('bulleted-list')
    }

    return true
  }

  onEnter = (event, change) => {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock, startOffset, endOffset } = value
    if (startOffset == 0 && startBlock.text.length == 0)
      return this.onBackspace(event, change)
    if (endOffset != startBlock.text.length) return

    if (
      startBlock.type != 'heading-one' &&
      startBlock.type != 'heading-two' &&
      startBlock.type != 'heading-three' &&
      startBlock.type != 'heading-four' &&
      startBlock.type != 'heading-five' &&
      startBlock.type != 'heading-six' &&
      startBlock.type != 'block-quote'
    ) {
      return
    }

    event.preventDefault()
    change.splitBlock().setBlock('paragraph')
    return true
  }

  // 摁下快捷键之后，设置当前选中文本要切换的富文本类型
  onKeyDown = (event, change) => {
    let mark;

    switch (event.key) {
      case ' ':
        return this.onSpace(event, change)
      case 'Backspace':
        return this.onBackspace(event, change)
      case 'Enter':
        return this.onEnter(event, change)
    }

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return;
    }


    event.preventDefault();
    change.toggleMark(mark);

    
    const { value } = change
    const { startBlock } = value
    if (event.key != 'Enter') return
    if (startBlock.type != 'code') return
    if (value.isExpanded) change.delete()
    change.insertText('\n')

    return true;
  };

  // 标记当前选中文本
  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  // 切换当前 block 类型
  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        change.setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some((block) => {
        return !!document.getClosest(
          block.key,
          parent => parent.type === type,
        );
      });

      if (isList && isType) {
        change
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list',
          )
          .wrapBlock(type);
      } else {
        change.setBlock('list-item').wrapBlock(type);
      }
    }
    this.onChange(change);
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    );
  };

  renderBlockButton = (type, icon) => {
    const isActive = this.hasBlock(type);
    const onMouseDown = event => this.onClickBlock(event, type);

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    );
  };

  // 配置 block type 对应在富文本里面的渲染组件
  renderNode = (props) => {
    const { attributes, children, node, isSelected  } = props;
    switch (node.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'image' : {
            const src = node.data.get('src')
            const className = isSelected ? 'active' : null
            const style = { display: 'block' }
            return (
              <img src={src} className={className} style={style} {...attributes} />
            )
        }
        case 'link': {
            const { data } = node
            const href = data.get('href')
            return (
              <a {...attributes} href={href}>
                {children}
              </a>
            )
        }
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'code':
            return <CodeBlock {...props} />
        case 'code_line':
            return <CodeBlockLine {...props} />
        default:
            return <div {...attributes}>{children}</div>;
    }
  };

  // 配置 mark 对应在富文本里面的渲染组件
  renderMark = (props) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
        case 'bold':
            return <strong>{children}</strong>;
        case 'code':
        return <code>{children}</code>;
        case 'italic':
            return <em>{children}</em>;
        case 'underlined':
            return <u>{children}</u>;
        case 'highlight':{
            return (
              <span {...attributes} style={{ backgroundColor: '#2e323f' }}>
                {children}
              </span>
            )
        }
        case 'comment':
            return (
              <span {...attributes} style={{ opacity: '0.33' }}>
                {children}
              </span>
            )
        case 'keyword':
            return (
              <span {...attributes} style={{ fontWeight: 'bold' }}>
                {children}
              </span>
            )
        case 'tag':
            return (
              <span {...attributes} style={{ fontWeight: 'bold' }}>
                {children}
              </span>
            )
        case 'punctuation':
            return (
              <span {...attributes} style={{ opacity: '0.75' }}>
                {children}
              </span>
            )
          case 'code':
            return <code {...attributes}>{children}</code>
          case 'italic':
            return <em {...attributes}>{children}</em>
          case 'underlined':
            return <u {...attributes}>{children}</u>
          case 'title': {
            return (
              <span
                {...attributes}
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  margin: '20px 0 10px 0',
                  display: 'inline-block',
                }}
              >
                {children}
              </span>
            )
          }
          case 'punctuation': {
            return (
              <span {...attributes} style={{ opacity: 0.2 }}>
                {children}
              </span>
            )
          }
          case 'list': {
            return (
              <span
                {...attributes}
                style={{
                  paddingLeft: '10px',
                  lineHeight: '10px',
                  fontSize: '20px',
                }}
              >
                {children}
              </span>
            )
          }
          case 'hr': {
            return (
              <span
                {...attributes}
                style={{
                  borderBottom: '2px solid #000',
                  display: 'block',
                  opacity: 0.2,
                }}
              >
                {children}
              </span>
            )
          }
        default:
        return <span>{children}</span>;
    }
  };

  insertImage = (change, src, target)=> {
  if (target) {
    change.select(target)
  }

  change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src },
  })
}

  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
      const { value } = this.state;
      // const change = value.change().insertText(`![](${src})`)
      const change = value.change().call(this.insertImage, src)
      console.log(change,'change')
      this.onChange(change)
  }

  onClickLink = event => {
    event.preventDefault()
    const { value } = this.state
    const hasLinks = this.hasLinks()
    const change = value.change()

    if (hasLinks) {
      change.call(unwrapLink)
    } else if (value.isExpanded) {
      const href = window.prompt('输入链接')
      change.call(wrapLink, href)
    } else {
      const href = window.prompt('输入链接')
      const text = window.prompt('输入该链接的文本')

      change
        .insertText(text)
        .extend(0 - text.length)
        .call(wrapLink, href)
    }

    this.onChange(change)
  }

    onInputChange = event => {
    const { value } = this.state
    const string = event.target.value
    const texts = value.document.getTexts()
    const decorations = []

    texts.forEach(node => {
      const { key, text } = node
      const parts = text.split(string)
      let offset = 0

      parts.forEach((part, i) => {
        if (i != 0) {
          decorations.push({
            anchorKey: key,
            anchorOffset: offset - string.length,
            focusKey: key,
            focusOffset: offset,
            marks: [{ type: 'highlight' }],
            atomic: true,
          })
        }

        offset = offset + part.length + string.length
      })
    })

    // setting the `save` option to false prevents this change from being added
    // to the undo/redo stack and clearing the redo stack if the user has undone
    // changes.

    const change = value
      .change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true)
    this.onChange(change)
  }


    tokenToContent = token => {
        if (typeof token == 'string') {
          return token
        } else if (typeof token.content == 'string') {
          return token.content
        } else {
          return token.content.map(this.tokenToContent).join('')
        }
    }

   decorateNode = node => {
        if (node.type != 'code') return

        const language = node.data.get('language')
        const texts = node.getTexts().toArray()
        const string = texts.map(t => t.text).join('\n')
        const grammar = Prism.languages[language]
        const tokens = Prism.tokenize(string, grammar)
        const decorations = []
        let startText = texts.shift()
        let endText = startText
        let startOffset = 0
        let endOffset = 0
        let start = 0

        for (const token of tokens) {
          startText = endText
          startOffset = endOffset

          const content = this.tokenToContent(token)
          const newlines = content.split('\n').length - 1
          const length = content.length - newlines
          const end = start + length

          let available = startText.text.length - startOffset
          let remaining = length

          endOffset = startOffset + remaining

          while (available < remaining && texts.length > 0) {
            endText = texts.shift()
            remaining = length - available
            available = endText.text.length
            endOffset = remaining
          }

          if (typeof token != 'string') {
            const range = {
              anchorKey: startText.key,
              anchorOffset: startOffset,
              focusKey: endText.key,
              focusOffset: endOffset,
              marks: [{ type: token.type }],
            }

            decorations.push(range)
          }

          start = end
        }

        return decorations
    }


    renderImage = () => {
        return (
          <div className="menu toolbar-menu">
            <span className="button" onMouseDown={this.onClickImage}>
              <span className="material-icons">image</span>
            </span>
          </div>
        )
    }

  hasLinks = () => {
    const { value } = this.state
    return value.inlines.some(inline => inline.type == 'link')
  }

  renderLink = ()=> {
    const hasLinks = this.hasLinks()
    return (
      <div className="menu toolbar-menu">
        <span
          className="button"
          onMouseDown={this.onClickLink}
          data-active={hasLinks}
        >
          <span className="material-icons">link</span>
        </span>
      </div>
    )
  }

  renderSearch = ()=> {
    return (
      <div className="menu toolbar-menu">
        <div className="search">
          <span className="search-icon material-icons">search</span>
          <input
            className="search-box"
            type="search"
            placeholder="搜索您要找的"
            onChange={this.onInputChange}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="rich-editor">
        <IceContainer>
          <div>
            <div className="rich-editor-menu rich-editor-toolbar-menu">
              {this.renderMarkButton('bold', 'format_bold')}
              {this.renderMarkButton('italic', 'format_italic')}
              {this.renderMarkButton('underlined', 'format_underlined')}
              {this.renderMarkButton('code', 'code')}
              {this.renderBlockButton('heading-one', 'looks_one')}
              {this.renderBlockButton('heading-two', 'looks_two')}
              {this.renderBlockButton('block-quote', 'format_quote')}
              {this.renderBlockButton('numbered-list', 'format_list_numbered')}
              {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
              {this.renderImage()}
              {this.renderLink()}
              {this.renderSearch()}
            </div>
            <div className="rich-editor-body">
              <Editor
                style={styles.editor}
                placeholder="请编写一些内容..."
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
                decorateNode={this.decorateNode}
                spellCheck
              />
            </div>
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  editor: {
    minHeight: 500,
  },
};

import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import React from 'react'

/**
 * The plain text example.
 *
 * @type {Component}
 */

class PlainText extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Plain.deserialize(
      ''
    ),
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder=""
        style={styles.editor}
        value={this.state.value}
        onChange={this.onChange}
      />
    )
  }

  /**
   * On change.
   *
   * @param {Change} change
   */
  onChange = ({value}) => {
    this.setState({ value })
    // // 如果上层有传递 onChange 回调，则应该传递上去
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(value.toJSON());
    }
  }
}

const styles = {
  editor: {
    minHeight: 500,
    backgroundColor: '#f4f4f4',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20
  },
};
/**
 * Export.
 */

export default PlainText

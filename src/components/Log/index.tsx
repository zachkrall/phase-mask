import { useRef, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { ObjectInspector } from 'react-inspector'
import { RootState } from '~/redux/store'
import { ReplLog } from '~/redux/repl'
import { selectIsVisible, UIPane } from '~/redux/ui'

import styles from './_.module.scss'
import { selectTFEstimates } from '~/redux/tensorflow'

const DevBar = () => {
  const container = useRef<HTMLDivElement | null>(null)

  const isVisible = useSelector(selectIsVisible(UIPane.Log))
  const history = useSelector<RootState, ReplLog[]>(state => state.repl.history)

  const estimates = useSelector(selectTFEstimates)

  useEffect(() => {
    if (container.current) {
      const parent = container.current

      parent.scrollTo({
        top: parent.scrollHeight,
      })
    }
  }, [history])

  return (
    <>
      {isVisible ? (
        <div className={styles['log']}>
          <div ref={container} className={styles['data']}>
            <h1
              style={{
                fontSize: 'inherit',
                fontWeight: '500',
                padding: '0 10px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Console
            </h1>
            {history.map((entry, index) => {
              let v
              try {
                v = JSON.parse(entry.text || '{}')
              } catch (e) {
                console.log(e)
                v = entry.text
              }
              return (
                <div key={(entry?.text || '') + index} className={styles['entry']} style={{padding: '0 10px'}}>
                  <span className={entry.state}>
                    <ObjectInspector
                      theme={{
                        BASE_FONT_FAMILY: '"Fira Code", monospace',
                        BASE_FONT_SIZE: '14px',
                        BASE_LINE_HEIGHT: 1.2,

                        BASE_BACKGROUND_COLOR: 'transparent',
                        BASE_COLOR: 'rgb(213, 213, 213)',

                        OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
                        OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
                        OBJECT_NAME_COLOR: 'rgb(227, 110, 236)',
                        OBJECT_VALUE_NULL_COLOR: 'rgb(127, 127, 127)',
                        OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(127, 127, 127)',
                        OBJECT_VALUE_REGEXP_COLOR: 'rgb(233, 63, 59)',
                        OBJECT_VALUE_STRING_COLOR: 'rgb(255, 255, 255)',
                        OBJECT_VALUE_SYMBOL_COLOR: 'rgb(233, 63, 59)',
                        OBJECT_VALUE_NUMBER_COLOR: 'hsl(252, 100%, 75%)',
                        OBJECT_VALUE_BOOLEAN_COLOR: 'hsl(252, 100%, 75%)',
                        OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(85, 106, 242)',

                        HTML_TAG_COLOR: 'rgb(93, 176, 215)',
                        HTML_TAGNAME_COLOR: 'rgb(93, 176, 215)',
                        HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
                        HTML_ATTRIBUTE_NAME_COLOR: 'rgb(155, 187, 220)',
                        HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(242, 151, 102)',
                        HTML_COMMENT_COLOR: 'rgb(137, 137, 137)',
                        HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',

                        ARROW_COLOR: 'rgb(145, 145, 145)',
                        ARROW_MARGIN_RIGHT: '3px',
                        ARROW_FONT_SIZE: '12px',
                        ARROW_ANIMATION_DURATION: '0',

                        TREENODE_FONT_FAMILY: '"Fira Code", monospace',
                        TREENODE_FONT_SIZE: '14px',
                        TREENODE_LINE_HEIGHT: '1.2',
                        TREENODE_PADDING_LEFT: '10px',

                        TABLE_BORDER_COLOR: 'rgb(85, 85, 85)',
                        TABLE_TH_BACKGROUND_COLOR: 'rgb(44, 44, 44)',
                        TABLE_TH_HOVER_COLOR: 'rgb(48, 48, 48)',
                        TABLE_SORT_ICON_COLOR: 'black', //'rgb(48, 57, 66)',
                        TABLE_DATA_BACKGROUND_IMAGE:
                          'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(51, 139, 255, 0.0980392) 50%, rgba(51, 139, 255, 0.0980392))',
                        TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
                      }}
                      data={v}
                    />
                  </span>
                  <span style={{ opacity: 0.3, flex: '0 0 auto' }}>{entry.timestamp}</span>
                </div>
              )
            })}
          </div>
          <div className={styles['data']}>
            <h1
              style={{
                fontSize: 'inherit',
                fontWeight: '500',
                padding: '0 10px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Face Estimates
            </h1>
            <div style={{padding: '0 10px'}}>
              <ObjectInspector
                theme={{
                  BASE_FONT_FAMILY: 'Menlo, monospace',
                  BASE_FONT_SIZE: '16px',
                  BASE_LINE_HEIGHT: 1.2,

                  BASE_BACKGROUND_COLOR: 'transparent',
                  BASE_COLOR: 'rgb(213, 213, 213)',

                  OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
                  OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
                  OBJECT_NAME_COLOR: 'rgb(227, 110, 236)',
                  OBJECT_VALUE_NULL_COLOR: 'rgb(127, 127, 127)',
                  OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(127, 127, 127)',
                  OBJECT_VALUE_REGEXP_COLOR: 'rgb(233, 63, 59)',
                  OBJECT_VALUE_STRING_COLOR: 'rgb(233, 63, 59)',
                  OBJECT_VALUE_SYMBOL_COLOR: 'rgb(233, 63, 59)',
                  OBJECT_VALUE_NUMBER_COLOR: 'hsl(252, 100%, 75%)',
                  OBJECT_VALUE_BOOLEAN_COLOR: 'hsl(252, 100%, 75%)',
                  OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(85, 106, 242)',

                  HTML_TAG_COLOR: 'rgb(93, 176, 215)',
                  HTML_TAGNAME_COLOR: 'rgb(93, 176, 215)',
                  HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
                  HTML_ATTRIBUTE_NAME_COLOR: 'rgb(155, 187, 220)',
                  HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(242, 151, 102)',
                  HTML_COMMENT_COLOR: 'rgb(137, 137, 137)',
                  HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',

                  ARROW_COLOR: 'rgb(145, 145, 145)',
                  ARROW_MARGIN_RIGHT: '3px',
                  ARROW_FONT_SIZE: '12px',
                  ARROW_ANIMATION_DURATION: '0',

                  TREENODE_FONT_FAMILY: 'Menlo, monospace',
                  TREENODE_FONT_SIZE: '16px',
                  TREENODE_LINE_HEIGHT: '1.2',
                  TREENODE_PADDING_LEFT: '10px',

                  TABLE_BORDER_COLOR: 'rgb(85, 85, 85)',
                  TABLE_TH_BACKGROUND_COLOR: 'rgb(44, 44, 44)',
                  TABLE_TH_HOVER_COLOR: 'rgb(48, 48, 48)',
                  TABLE_SORT_ICON_COLOR: 'black', //'rgb(48, 57, 66)',
                  TABLE_DATA_BACKGROUND_IMAGE:
                    'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(51, 139, 255, 0.0980392) 50%, rgba(51, 139, 255, 0.0980392))',
                  TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
                }}
                data={estimates}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default DevBar

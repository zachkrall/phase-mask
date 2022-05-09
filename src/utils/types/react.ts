import * as React from 'react'

export type PropsWithChildren<T> = T & {children?: React.ReactNode}
export type Component<T = Record<string, unknown>> = React.FunctionComponent<PropsWithChildren<T>>

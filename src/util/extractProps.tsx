export type ExtractProps<T> = T extends React.FC<infer U> ? U : never;
export default ExtractProps;

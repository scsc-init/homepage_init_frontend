import './Title.css';

export default function Title({
  text,
}: {
  text: string | string[] | undefined;
}) {
  return (
    <div className="width-restrictor">
      <div className="title-flex">{text}</div>
    </div>
  );
}

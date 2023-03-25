export default function AudioSource({
  file,
  audioRef,
}: {
  file: File;
  audioRef: React.RefObject<HTMLAudioElement>;
}) {
  //TODO: look into this
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio src={URL.createObjectURL(file)} ref={audioRef} />;
}

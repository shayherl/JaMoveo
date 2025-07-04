export default function SongWithChords({content}){

    const formatLine = (line) =>{
        let chordLine = '';
        let lyricsLine = '';

        line.forEach(word => {
            const space = ' '.repeat(word.lyrics.length + 1);
            if (word.chords){
                chordLine += word.chords.padEnd(word.lyrics.length + 1, ' ');
            }
            else{
                chordLine += space
            }
            lyricsLine += word.lyrics + ' ';
        });

        return(
            <pre>
                <span>{chordLine}</span>
                {'\n'}
                {lyricsLine}
            </pre>
        )
    }

    return(
        <div>
        {content.map((line, i) => (
            <p key={i}>
                {formatLine(line)}
            </p>
        ))}
        </div>
    )
}
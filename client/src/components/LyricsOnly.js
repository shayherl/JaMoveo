export default function LyricsOnly({content}){
    return(
        <div>
        {content.map((line, i) => (
            <p key={i}>
                {line.map(word => word.lyrics).join(' ')}
            </p>
        ))}
        </div>
    )
}
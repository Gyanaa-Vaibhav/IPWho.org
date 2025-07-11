import '../styles/CardComponent.css'

type Props = {
    image: string,
    imageAlt: string,
    title: string,
    desc: string
}

export function CardComponent({ image, imageAlt, title, desc }:Props) {
    return (
        <>
            <div className="cardComponent">
                <img src={image} alt={imageAlt} role="presentation" loading="lazy" />
                <h3>{ title }</h3>
                <p>{ desc }</p>
            </div>
        </>
    )
}
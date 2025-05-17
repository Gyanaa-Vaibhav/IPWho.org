import SyntaxHighlighter from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import '../styles/FeatureComponent.css'
type Props = {
    title: string,
    para1: string,
    para2: string,
    lines:string
}

export function FeatureComponent({title,para1,para2,lines}:Props) {
    return (
        <>
            <div className="featureComponentHolder">
                <div className="featureInfo">
                    <h3 className="featureTitle">{ title }</h3>
                    <p className="featurePara1">{ para1 }</p>
                    <p className="featurePara2">{ para2 }</p>
                </div>
                <div className='codeBlock'>
                    <SyntaxHighlighter language="json" style={a11yDark}>
                        {lines}
                    </SyntaxHighlighter>
                </div>
            </div>
        </>
    )
}
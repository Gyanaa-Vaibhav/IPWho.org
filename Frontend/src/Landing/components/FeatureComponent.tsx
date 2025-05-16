import { TerminalTypewriter } from '../../App';
import '../styles/FeatureComponent.css'
type Props = {
    title: string,
    para1: string,
    para2: string,
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
                    <TerminalTypewriter lines={lines} />
                </div>
            </div>
        </>
    )
}
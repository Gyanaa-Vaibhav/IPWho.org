import React from 'react';
import '../../styles/SkeletonList.css';

type SkeletonItem = {
    heading: string;
    lineCount: number;
    icon:string,
    iconAlt:string
};

type SkeletonListWithCustomLoadersProps = {
    items: SkeletonItem[];
};

export default function SkeletonListWithCustomLoaders(
    {
        items,
    }: SkeletonListWithCustomLoadersProps) {

    return (
        <div className="skeleton-wrapper">
            {items.map(({ heading, lineCount,iconAlt,icon }, i) => (
                <div key={i} className="skeleton-item">
                    <div className='data-Header'>
                        <img
                            src={icon}
                            alt={iconAlt}
                            loading={"lazy"}
                        />
                        <p>{heading}</p>
                    </div>
                    <div className='data-Body'>
                    <ul className="loading">
                        {[...Array(lineCount)].map((_, j) => (
                            <li key={j} className="skeleton-line">&nbsp;</li>
                        ))}
                    </ul>
                    <ul className="loading">
                        {[...Array(lineCount)].map((_, j) => (
                            <li key={j} className="skeleton-line">&nbsp;</li>
                        ))}
                    </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}




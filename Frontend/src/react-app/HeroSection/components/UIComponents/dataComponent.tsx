import '../../styles/dataComponent.css';

type props = {
    type:string,
    title:string,
    icon:string,
    iconAlt:string,
    data:Record<string, string>[]
}

type wrapperProps = {
    items:props[],
}

function DataComponent({title,type,data,icon,iconAlt}:props) {
    const mergedData: Record<string, string> = Object.assign({}, ...(data || []));
    const entries = Object.entries(mergedData);
    const midpoint = Math.ceil(entries.length / 2);
    const firstHalf = entries.slice(0, midpoint);
    const secondHalf = entries.slice(midpoint);
    const formatKey = (key: string) =>
        key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    const formatValue = (value: string | boolean): string => {
        if(typeof value === 'number') {
            return value
        }

        if (typeof value === 'boolean') {
            return value ? 'True' : 'False';
        }

        if (!value) return "Null";

        const isoDateTimeMatch = value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        if (isoDateTimeMatch) {
            const timePart = isoDateTimeMatch[0].slice(11);
            const [hourStr, minuteStr] = timePart.split(':');
            let hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12;
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
        }

        return value.toString();
    };


    const filteredDataFirstHalf = firstHalf.map(([key, value]) => (
        <li key={key}>
            {formatKey(key)}: {formatValue(value)}
        </li>
    ));
    const filteredDataSecondHalf = secondHalf.map(([key, value]) => (
        <li key={key}>
            {formatKey(key)}: {formatValue(value)}
        </li>
    ));

    return(
        <>
            <div className={`${type}-Data Data`}>
                <div className='data-Header'>
                    <img
                        src={icon}
                        alt={iconAlt}
                        loading={"lazy"}
                    />
                    <p>{title}</p>
                </div>
                <div className='data-Body'>
                    <ul>
                        {filteredDataFirstHalf}
                    </ul>
                    <ul>
                        {filteredDataSecondHalf}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default function DataComponentWrapper({items}:wrapperProps){
    return (
        <>
            {items.map(({title,type,data,icon,iconAlt},index) => {
                return (
                    <DataComponent
                        key={index}
                        title={title}
                        type={type}
                        data={data}
                        icon={icon}
                        iconAlt={iconAlt}
                    />
                )
            })
            }
        </>
    )
}
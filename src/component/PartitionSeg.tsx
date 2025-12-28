import React from "react";
import { View, Image} from "react-native";
import Svg, {Circle, G} from "react-native-svg"

interface Props {
    size: number;
    strokeWidth?: number;
    statuses: any[];
    avatar: string;
    hasNew?: boolean
}
export default function PartitionSeg({size, strokeWidth=1,
     statuses, avatar, hasNew=true}: Props) {
    const count = statuses.length || 1;

    const radius = (size - strokeWidth) /2;
    const circumference  = 2 * Math.PI * radius;

    const gapDegrees = 8;
    const segmentDegrees = (360 -gapDegrees * count) /count;
    const segmentLength = (segmentDegrees / 360) * circumference;
    const gapLength = (gapDegrees /360) * circumference

    const innerSize =  size - strokeWidth * 1.5
    return(
<View style={{width: size, height: size, justifyContent: "center", alignItems: "center"}}>

<Svg width={size} height={size} style={{position: "absolute"}}>
    <G rotation={-90} origin={`${size /2}, ${size /2}`}>
{statuses.map((_, index) => {
        const dashOffset = 
        circumference  - index * (segmentLength + gapLength)
        return (
            <Circle
            key={index}
            cx={size/2}
            cy={size/2}
            r={radius}
            stroke={hasNew ? "rgba(10, 157, 241, 1)" : "#ccc"}
            fill="none"
            strokeDasharray = {`${segmentLength} ${gapLength}`}
            strokeDashOffset={dashOffset}
            strokeWidth={strokeWidth}
            strokeLinecap ="butt"
            />
        );
    })}
    </G>
</Svg>

<Image source={{uri: avatar}}
style={{width: innerSize, height: innerSize,
    borderRadius: innerSize /2
 }}  />
</View>
    )
}

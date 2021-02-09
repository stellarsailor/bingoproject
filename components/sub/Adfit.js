import React, { useEffect } from 'react';
import loadScript from '../../lib/load-script';

// export default class Adfit extends React.Component {

//     shouldComponentUpdate() {
//         return false;
//     }

//     // componentWillMount() {
//     componentDidMount(){
//         // window.adfit || loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){})
//         loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){})
//         // console.log('loadingScript')
//     }

//     componentDidMount() {
//         // console.log(document.getElementById('daumAd')) 원래 주석
//         // window.adfit.render() 원래 주석

//         // console.log('rendered')
//     }

//     componentWillUnmount() {
//         // console.log(window.adfit)
//         // window.adfit.destroy(this.props.adUnit)

//         // console.log('destroy')
//     }

//     render() {
export default function Adfit(props){
    let id;
    let w;
    let h;

    if(props.adType === 'pc-long'){
        id = 'DAN-t4l58bdqmhpt'
        w = 160
        h = 600
    } else if(props.adType === 'square-250'){
        id = 'DAN-1hvb2gxdzyusi'
        w = 250
        h = 250
    } else if(props.adType === 'mobile-wide-50'){
        id = 'DAN-a25Hq7iBxwtLsi7F'
        w = 320
        h = 50
    } else if(props.adType === 'mobile-wide-100'){
        id = 'DAN-ttfnsX9otDmX5zSE'
        w = 320
        h = 100
    } else if(props.adType === 'pc-wide'){
        id = 'DAN-UunaIkVVjWiPDeUh'
        w = 728
        h = 90
    }

    useEffect(() => {
        // window.adfit || loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){})
        // loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){}) //이것 사용
    },[])

        return (
            <></>
            // <div key={Math.random} style={{display: 'flex', justifyContent: 'center', margin: props.margin, height: parseInt(h), zIndex: 0}}>
            //     <ins className={'kakao_ad_area'}
            //         style={{
            //             display: 'block',
            //             width: '100%'
            //         }}
            //         data-ad-unit={id}
            //         data-ad-width={w}
            //         data-ad-height={h}
            //         data-ad-test={true} //props.adTest || 'N'}
            //         data-ad-param-channel={props.adParamChannel}
            //         data-ad-param-cp={props.adParamCp}
            //         >
            //     </ins>
            // </div>
            )
    // }
}
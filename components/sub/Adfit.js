import React from 'react';
import loadScript from '../../lib/load-script';

export default class Adfit extends React.Component {

    shouldComponentUpdate() {
        return false;
    }

    // componentWillMount() {
    componentDidMount(){
        // window.adfit || loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){})
        loadScript('https://t1.daumcdn.net/kas/static/ba.min.js', function(){})
        // console.log('loadingScript')
    }

    componentDidMount() {
        // console.log(document.getElementById('daumAd')) 원래 주석
        // window.adfit.render() 원래 주석

        // console.log('rendered')
    }

    componentWillUnmount() {
        // console.log(window.adfit)
        // window.adfit.destroy(this.props.adUnit)

        // console.log('destroy')
    }

    render() {

        return (
            <div key={Math.random} style={{display: 'flex', justifyContent: 'center', margin: this.props.margin, height: parseInt(this.props.adHeight)}}>
                <ins className={'kakao_ad_area'}
                    style={{
                        display: 'block',
                        width: '100%'
                    }}
                    data-ad-unit={this.props.adUnit}
                    data-ad-width={this.props.adWidth}
                    data-ad-height={this.props.adHeight}
                    data-ad-test={true} //this.props.adTest || 'N'}
                    data-ad-param-channel={this.props.adParamChannel}
                    data-ad-param-cp={this.props.adParamCp}
                    >
                </ins>
            </div>
            )
    }
}
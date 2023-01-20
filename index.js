import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';

export interface Props {
  disabled: boolean;
}

const ComponentViewPort = class extends Component<Props> {
  lastValue: null;
  interval: any;
  myview: any;
  constructor(props: Props) {
    super(props);
    this.state = { rectTop: 0, rectBottom: 0 };
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this.stopWatching();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching();
    } else {
      this.lastValue = null;
      this.startWatching();
    }
  }

  startWatching() {
    if (this.interval) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return;
      }
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY,
          rectBottom: pageY + height,
          rectWidth: pageX + width,
        });
      });
      this.isComponentViewPort();
    }, this.props.delay || 100);
  }

  stopWatching() {
    this.interval = clearInterval(this.interval);
  }

  isComponentViewPort() {
    const window = Dimensions.get('window');
    const { rectBottom = 0, rectTop = 0} = this.state;
    const isVisible =
      (rectTop <= window.height && rectTop > 0) || (rectBottom > 0 && rectBottom <= window.height);
    this.props.onChange(isVisible);
  }
  measureView(event) {
    // TODO for future implementation
  }

  render() {
    return (
      <View
        onLayout={event => {
          this.measureView(event);
        }}
        ref={component => {
          this.myview = component;
        }}
        {...this.props}>
        {this.props.children}
      </View>
    );
  }
};

export default ComponentViewPort;

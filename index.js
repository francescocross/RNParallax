import React, { Component, useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types';
import { useHeaderHeight } from '@react-navigation/stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Platform,
  Animated,
  Text,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import normalize from 'react-native-normalize';

const {
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
; //Ricontrollare quel 54, potrebbe essere diverso (DI DEFAULT ERA 44)
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 54 : 20) : 20;


const SCROLL_EVENT_THROTTLE = 16;
const DEFAULT_HEADER_MAX_HEIGHT = 150;
const DEFAULT_EXTRA_SCROLL_HEIGHT = 30;
const DEFAULT_BACKGROUND_IMAGE_SCALE = 1.5;

const DEFAULT_NAVBAR_COLOR = '#3498db';
const DEFAULT_BACKGROUND_COLOR = '#303F9F';
const DEFAULT_TITLE_COLOR = 'white';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: DEFAULT_NAVBAR_COLOR,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: DEFAULT_HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerTitle: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: "5%",
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  navBarTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: DEFAULT_TITLE_COLOR,
    textAlign: 'center',
    fontSize: 16,
  },
  refreshBtn: {
    position: "absolute",
    left: "80%",
    top: "88%",
    right: 500,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    width: normalize(60),
    height: normalize(60),
    borderRadius: 40,
    backgroundColor: "white",
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5
  }
});

const RNParallax = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  const STATUS_BAR_HEIGHT = useHeaderHeight();
  const NAV_BAR_HEIGHT = useHeaderHeight();
  const DEFAULT_HEADER_MIN_HEIGHT = NAV_BAR_HEIGHT;

  const getHeaderMaxHeight = () => {
    const { headerMaxHeight } = props;
    return headerMaxHeight;
  }

  const getHeaderMinHeight = () => {
    const { headerMinHeight } = props;
    return headerMinHeight;
  }

  const getHeaderScrollDistance = () => {
    return getHeaderMaxHeight() - getHeaderMinHeight();
  }

  const getExtraScrollHeight = () => {
    const { extraScrollHeight } = props;
    return extraScrollHeight;
  }

  const getBackgroundImageScale = () => {
    const { backgroundImageScale } = props;
    return backgroundImageScale;
  }

  const getInputRange = () => {
    return [-getExtraScrollHeight(), 0, getHeaderScrollDistance()];
  }

  const getInputRangeFourValues = () => {
    return [-getExtraScrollHeight(), 0, getHeaderScrollDistance() - 2, getHeaderScrollDistance()];
  }

  const getInputRangeFourValuesTitle = () => {
    return [-getExtraScrollHeight(), 0, getHeaderScrollDistance() - 60, getHeaderScrollDistance()];
  }

  const getHeaderHeight = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [getHeaderMaxHeight() + getExtraScrollHeight(), getHeaderMaxHeight(), getHeaderMinHeight()],
      extrapolate: 'clamp',
    });
  }

  const getNavBarOpacity = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });
  }

  const getNavBarForegroundOpacity = () => {
    const { alwaysShowNavBar } = props;
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [alwaysShowNavBar ? 1 : 0, alwaysShowNavBar ? 1 : 0, 1],
      extrapolate: 'clamp',
    });
  }

  const getImageOpacity = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
  }

  const getImageTranslate = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [0, 0, -50],
      extrapolate: 'clamp',
    });
  }

  const getImageScale = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [getBackgroundImageScale(), 1, 1],
      extrapolate: 'clamp',
    });
  }

  const getTitleTranslateY = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [5, 0, 0],
      extrapolate: 'clamp',
    });
  }

  const getTitleOpacity = () => {
    const { alwaysShowTitle } = props;
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [1, 1, alwaysShowTitle ? 1 : 0],
      extrapolate: 'clamp',
    });
  }

  const getTitleOpacityMemoized = () => {
    const { alwaysShowTitle } = props;
    return scrollY.interpolate({
      inputRange: getInputRangeFourValuesTitle(),
      outputRange: [1, 1, 0, 0],
      extrapolate: 'clamp',
    });
  }

  const getNavBarTitleOpacity = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
  }

  const getBorderRadiusBottom = () => {
    return scrollY.interpolate({
      inputRange: getInputRange(),
      outputRange: [100, 80, 0],
      extrapolate: 'clamp',
    });
  }

  const getNavBarBorderWidth = () => {
    return scrollY.interpolate({
      inputRange: getInputRangeFourValues(),
      outputRange: [0, 0, 0, Platform.OS === 'ios' ? 1 : 0],
      extrapolate: 'clamp',
    });
  }


  const renderBackgroundImage = () => {
    const { backgroundImage } = props;
    const imageOpacity = getImageOpacity();
    const imageTranslate = getImageTranslate();
    const imageScale = getImageScale();

    return (
      <Animated.Image
        style={[
          styles.backgroundImage,
          {
            height: getHeaderMaxHeight(),
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }, { scale: imageScale }],
          },
        ]}
        source={backgroundImage}
      />
    );
  }

  const renderPlainBackground = () => {
    const { backgroundColor } = props;

    const imageOpacity = getImageOpacity();
    const imageTranslate = getImageTranslate();
    const imageScale = getImageScale();

    return (
      <Animated.View
        style={{
          height: getHeaderMaxHeight(),
          backgroundColor,
          opacity: imageOpacity,
          transform: [{ translateY: imageTranslate }, { scale: imageScale }],
        }}
      />
    );
  }

  const renderNavbarBackground = () => {
    const { navbarColor } = props;
    const navBarOpacity = getNavBarOpacity();

    return (
      <Animated.View
        style={[
          styles.header,
          {
            height: getHeaderHeight(),
            backgroundColor: navbarColor,
            opacity: navBarOpacity,
            borderBottomWidth: getNavBarBorderWidth(),
            borderBottomColor: "rgba(232, 232, 232, 1)",
            borderBottomRightRadius: getBorderRadiusBottom()
          },
        ]}



      />
    );
  }

  const renderHeaderBackground = () => {
    const { backgroundImage, backgroundColor } = props;
    const imageOpacity = getImageOpacity();

    return (
      <Animated.View
        style={[
          styles.header,
          {
            height: getHeaderHeight(),
            opacity: imageOpacity,
            backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
            borderBottomRightRadius: getBorderRadiusBottom(),
            overflow: "hidden"
          },
        ]}
      >
        <Animated.View
          style={[
            styles.header,
            {
              height: getHeaderHeight(),
              opacity: imageOpacity,
              backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
            },
          ]}
        >
          {backgroundImage && renderBackgroundImage()}
          {!backgroundImage && renderPlainBackground()}
        </Animated.View>
      </Animated.View>
    );
  }

  const renderHeaderTitle = () => {
    const { title, titleStyle, headerTitleStyle, titleColorAccent } = props;
    const titleTranslateY = getTitleTranslateY();
    const titleOpacity = getTitleOpacityMemoized();

    return (
      <Animated.View
        style={[
          styles.headerTitle,
          {
            transform: [
              { translateY: titleTranslateY },
            ],
            height: getHeaderHeight(),
            opacity: titleOpacity,
            paddingTop: normalize(30, "height")

          },
          headerTitleStyle
        ]}
      >
        {typeof title === 'string'
          && (
            <View>
              <Text style={[styles.headerText, titleStyle, { color: titleColorAccent, fontSize: normalize(35) }]}>
                Bentornato
          </Text>
              <Text style={[titleStyle, { color: titleColorAccent }]}>
                {title}
              </Text>
            </View>
          )
        }
        {typeof title !== 'string' && title}
      </Animated.View>
    );
  }

  const renderNavBarTitle = () => {
    const { titleColorPrimary, titleColorAccent } = props;
    const titleTranslateY = getTitleTranslateY();

    return (
      <Animated.View
        style={[
          styles.navBarTitle,
          {
            transform: [
              { translateY: titleTranslateY },
            ],
            opacity: getNavBarTitleOpacity(),
            paddingTop: "10%"
          },
        ]}
      >
        {Platform.OS === 'ios' && <Text style={{ color: Platform.OS === 'ios' ? titleColorPrimary : titleColorAccent, fontSize: Platform.OS === "ios" ? 18 : 20, fontFamily: "montserrat" }}>
          Home
        </Text>}

      </Animated.View>
    );
  }

  const renderHeaderForeground = () => {
    const { renderNavBar } = props;
    const navBarOpacity = getNavBarForegroundOpacity();

    return (
      <Animated.View
        style={[
          styles.bar,
          {
            height: getHeaderMinHeight(),
            opacity: navBarOpacity,
            height: DEFAULT_HEADER_MIN_HEIGHT,
          },
        ]}
      >
        {renderNavBar()}
      </Animated.View>
    );
  }

  const renderScrollView = () => {
    const {
      renderContent, scrollEventThrottle, scrollViewStyle, contentContainerStyle, innerContainerStyle, scrollViewProps,
    } = props;

    return (
      <Animated.ScrollView
        style={[styles.scrollView, scrollViewStyle]}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={scrollEventThrottle}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        )}
        {...scrollViewProps}
      >
        <View style={[{ marginTop: getHeaderMaxHeight() }, innerContainerStyle]}>
          {renderContent()}
        </View>
      </Animated.ScrollView>
    );
  }

  const { navbarColor, statusBarColor, containerStyle, titleColorPrimary, titleColorAccent, isRefreshNews } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar
        backgroundColor={statusBarColor || navbarColor}
      />

      <TouchableOpacity useForeground style={[styles.refreshBtn, { backgroundColor: titleColorPrimary }]} onPress={props.onPressRefresh}>
        <View style={{ alignItems: "center", justifyContent: "center" }} >
          {isRefreshNews && <ActivityIndicator size="large" color={titleColorAccent} />}
          {!isRefreshNews && <Ionicons name={Platform.OS === "android" ? 'md-refresh' : 'ios-refresh'} size={normalize(30)} color={titleColorAccent} />}
        </View>
      </TouchableOpacity>

      {renderScrollView()}
      {renderNavbarBackground()}
      {renderHeaderBackground()}
      {renderNavBarTitle()}
      {renderHeaderTitle()}
      {renderHeaderForeground()}
    </View>
  );
}

RNParallax.propTypes = {
  renderNavBar: PropTypes.func,
  renderContent: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string,
  backgroundImage: PropTypes.any,
  navbarColor: PropTypes.string,
  title: PropTypes.any,
  titleStyle: PropTypes.any,
  headerTitleStyle: PropTypes.any,
  headerMaxHeight: PropTypes.number,
  headerMinHeight: PropTypes.number,
  scrollEventThrottle: PropTypes.number,
  extraScrollHeight: PropTypes.number,
  backgroundImageScale: PropTypes.number,
  contentContainerStyle: PropTypes.any,
  innerContainerStyle: PropTypes.any,
  scrollViewStyle: PropTypes.any,
  containerStyle: PropTypes.any,
  alwaysShowTitle: PropTypes.bool,
  alwaysShowNavBar: PropTypes.bool,
  statusBarColor: PropTypes.string,
  scrollViewProps: PropTypes.object,
};

RNParallax.defaultProps = {
  renderNavBar: () => <View />,
  navbarColor: DEFAULT_NAVBAR_COLOR,
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  backgroundImage: null,
  title: null,
  titleStyle: styles.headerText,
  headerTitleStyle: null,
  headerMaxHeight: DEFAULT_HEADER_MAX_HEIGHT,
  scrollEventThrottle: SCROLL_EVENT_THROTTLE,
  extraScrollHeight: DEFAULT_EXTRA_SCROLL_HEIGHT,
  backgroundImageScale: DEFAULT_BACKGROUND_IMAGE_SCALE,
  contentContainerStyle: null,
  innerContainerStyle: null,
  scrollViewStyle: null,
  containerStyle: null,
  alwaysShowTitle: true,
  alwaysShowNavBar: true,
  statusBarColor: null,
  scrollViewProps: {},
};

export default RNParallax;

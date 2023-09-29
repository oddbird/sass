import {Value} from './index';

/** The HSL color space name. */
export type ColorSpaceHSL = 'hsl';

/** The HSL color space channel names. */
export type ChannelNameHSL = 'hue' | 'saturation' | 'lightness';

/** The HWB color space name. */
export type ColorSpaceHWB = 'hwb';

/** The HWB color space channel names. */
export type ChannelNameHWB = 'hue' | 'whiteness' | 'blackness';

/** The Lab / Oklab color space names. */
export type ColorSpaceLab = 'lab' | 'oklab';

/** The Lab / Oklab color space channel names. */
export type ChannelNameLab = 'lightness' | 'a' | 'b';

/** The LCH / Oklch color space names. */
export type ColorSpaceLCH = 'lch' | 'oklch';

/** The LCH / Oklch color space channel names. */
export type ChannelNameLCH = 'lightness' | 'chroma' | 'hue';

/** Names of color spaces with RGB channels. */
export type ColorSpaceRGB =
  | 'a98-rgb'
  | 'display-p3'
  | 'prophoto-rgb'
  | 'rgb'
  | 'srgb'
  | 'srgb-linear';

/** RGB channel names. */
export type ChannelNameRGB = 'red' | 'green' | 'blue';

/** Names of color spaces with XYZ channels. */
export type ColorSpaceXYZ = 'xyz' | 'xyz-d50' | 'xyz-d65';

/** XYZ channel names. */
export type ChannelNameXYZ = 'x' | 'y' | 'z';

/** All supported color space names. */
export type ChannelName =
  | ChannelNameHSL
  | ChannelNameHWB
  | ChannelNameLab
  | ChannelNameLCH
  | ChannelNameRGB
  | ChannelNameXYZ;

/** All supported color space channel names. */
export type KnownColorSpace =
  | ColorSpaceHSL
  | ColorSpaceHWB
  | ColorSpaceLab
  | ColorSpaceLCH
  | ColorSpaceRGB
  | ColorSpaceXYZ;

/** Polar color space names (HSL, HWB, LCH, and Oklch spaces). */
export type PolarColorSpace = ColorSpaceHSL | ColorSpaceHWB | ColorSpaceLCH;

/** Rectangle color space names (Lab, Oklab, RGB, and XYZ spaces). */
export type RectangularColorSpace = Exclude<KnownColorSpace, PolarColorSpace>;

/**
 * Methods by which two hues are adjusted when interpolating between colors.
 */
export type HueInterpolationMethod =
  | 'decreasing'
  | 'increasing'
  | 'longer'
  | 'shorter';

/**
 * Sass's [color type](https://sass-lang.com/documentation/values/colors).
 *
 * No matter what representation was originally used to create this color, all
 * of its channels are accessible.
 *
 * @category Custom Function
 */
export class SassColor extends Value {
  /**
   * Creates an RGB color.
   *
   * If `space` is missing, **only** `undefined` should be passed to indicate a
   * missing `alpha`. If `null` is passed instead, it will be treated as a
   * [missing component] in future versions of Dart Sass. See [breaking changes]
   * for details.
   *
   * If `space` is defined and `null` is passed for `alpha`, it will be treated
   * as a [missing component]. In most cases, this is equivalent to the color
   * being transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   * [breaking changes]: /documentation/breaking-changes/null-alpha
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   * @throws `Error` if `space` is missing and `red`, `green`, or `blue` isn't
   * between `0` and `255`.
   */
  constructor(options: {
    red: number | null;
    green: number | null;
    blue: number | null;
    alpha?: number | null;
    space?: 'rgb';
  });

  /**
   * Creates an HSL color.
   *
   * If `space` is missing, **only** `undefined` should be passed to indicate a
   * missing `alpha`. If `null` is passed instead, it will be treated as a
   * [missing component] in future versions of Dart Sass. See [breaking changes]
   * for details.
   *
   * If `space` is defined and `null` is passed for `alpha`, it will be treated
   * as a [missing component]. In most cases, this is equivalent to the color
   * being transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   * [breaking changes]: /documentation/breaking-changes/null-alpha
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   * @throws `Error` if `space` is missing and `saturation` or `lightness` isn't
   * between `0` and `100`.
   */
  constructor(options: {
    hue: number | null;
    saturation: number | null;
    lightness: number | null;
    alpha?: number | null;
    space?: ColorSpaceHSL;
  });

  /**
   * Creates an HWB color.
   *
   * If `space` is missing, **only** `undefined` should be passed to indicate a
   * missing `alpha`. If `null` is passed instead, it will be treated as a
   * [missing component] in future versions of Dart Sass. See [breaking changes]
   * for details.
   *
   * If `space` is defined and `null` is passed for `alpha`, it will be treated
   * as a [missing component]. In most cases, this is equivalent to the color
   * being transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   * [breaking changes]: /documentation/breaking-changes/null-alpha
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   * @throws `Error` if `space` is missing and `whiteness` or `blackness` isn't
   * between `0` and `100`.
   */
  constructor(options: {
    hue: number | null;
    whiteness: number | null;
    blackness: number | null;
    alpha?: number | null;
    space?: ColorSpaceHWB;
  });

  /**
   * Creates a Lab or Oklab color.
   *
   * If `null` is passed for `alpha`, it will be treated as a [missing
   * component]. In most cases, this is equivalent to the color being
   * transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   */
  constructor(options: {
    lightness: number | null;
    a: number | null;
    b: number | null;
    alpha?: number | null;
    space: ColorSpaceLab;
  });

  /**
   * Creates an LCH or Oklch color.
   *
   * If `null` is passed for `alpha`, it will be treated as a [missing
   * component]. In most cases, this is equivalent to the color being
   * transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   */
  constructor(options: {
    lightness: number | null;
    chroma: number | null;
    hue: number | null;
    alpha?: number | null;
    space: ColorSpaceLCH;
  });

  /**
   * Creates a color in a predefined RGB color space.
   *
   * If `null` is passed for `alpha`, it will be treated as a [missing
   * component]. In most cases, this is equivalent to the color being
   * transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   */
  constructor(options: {
    red: number | null;
    green: number | null;
    blue: number | null;
    alpha?: number | null;
    space: Exclude<ColorSpaceRGB, 'rgb'>;
  });

  /**
   * Creates a color in a predefined XYZ color space.
   *
   * If `null` is passed for `alpha`, it will be treated as a [missing
   * component]. In most cases, this is equivalent to the color being
   * transparent.
   *
   * [missing component]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `alpha` isn't between `0` and `1`.
   */
  constructor(options: {
    x: number | null;
    y: number | null;
    z: number | null;
    alpha?: number | null;
    space: ColorSpaceXYZ;
  });

  /** The name of this color's space. */
  get space(): KnownColorSpace;

  /**
   * A boolean indicating whether this color is in a legacy color space (`rgb`,
   * `hsl`, or `hwb`).
   */
  get isLegacy(): boolean;

  /**
   * An array of this color's channel values (excluding alpha), with [missing
   * channels] converted to `null`.
   *
   * [missing channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   */
  get channelsOrNull(): [number | null, number | null, number | null];

  /**
   * An array of this color's channel values (excluding alpha), with [missing
   * channels] converted to `0`.
   *
   * [missing channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   */
  get channels(): [number, number, number];

  /** This color's alpha channel, between `0` and `1`. */
  get alpha(): number;

  /**
   * A boolean indicating whether this color's alpha channel is a [missing
   * channel].
   *
   * [missing channel]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   */
  get isAlphaMissing(): boolean;

  /**
   * Returns this color converted to the specified `space`.
   */
  toSpace(space: KnownColorSpace): SassColor;

  /**
   * Returns a boolean indicating whether this color is in gamut (as opposed to
   * having one or more of its channels out of bounds) for the specified
   * `space`, or its current color space if `space` is not specified.
   */
  isInGamut(space?: KnownColorSpace): boolean;

  /**
   * Returns this color, modified so it is in gamut for the specified `space` --
   * or the current color space if `space` is not specified -- using the
   * recommended [CSS Gamut Mapping Algorithm][css-mapping] to map out-of-gamut
   * colors into the desired gamut with as little perceptual change as possible.
   *
   * [css-mapping]: https://www.w3.org/TR/css-color-4/#css-gamut-mapping-algorithm
   */
  toGamut(space?: KnownColorSpace): SassColor;

  /**
   * Returns the value of a single specified `channel` of this color, with
   * [missing channels] converted to `0`.
   *
   * [missing channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `channel` is not `alpha` or a channel in this color's
   * space.
   */
  channel(channel: ChannelName): number;

  /**
   * Returns the value of a single specified `channel` of this color after
   * converting this color to the specified `space`, with [missing channels]
   * converted to `0`.
   *
   * [missing channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   *
   * @throws `Error` if `channel` is not `alpha` or a channel in `space`.
   */
  channel(
    channel: ChannelNameHSL | 'alpha',
    options: {space: ColorSpaceHSL}
  ): number;
  channel(
    channel: ChannelNameHWB | 'alpha',
    options: {space: ColorSpaceHWB}
  ): number;
  channel(
    channel: ChannelNameLab | 'alpha',
    options: {space: ColorSpaceLab}
  ): number;
  channel(
    channel: ChannelNameLCH | 'alpha',
    options: {space: ColorSpaceLCH}
  ): number;
  channel(
    channel: ChannelNameRGB | 'alpha',
    options: {space: ColorSpaceRGB}
  ): number;
  channel(
    channel: ChannelNameXYZ | 'alpha',
    options: {space: ColorSpaceXYZ}
  ): number;

  /**
   * Returns a boolean indicating whether a given channel value is a [missing
   * channel].
   *
   * [missing channel]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components
   */
  isChannelMissing(channel: ChannelName | 'alpha'): boolean;

  /**
   * Returns a boolean indicating whether a given `channel` is "powerless" in
   * this color. This is a special state that's defined for individual color
   * spaces, which indicates that a channel's value won't affect how a color is
   * displayed.
   */
  isChannelPowerless(channel: ChannelName): boolean;
  isChannelPowerless(
    channel: ChannelNameHSL,
    options?: {space: ColorSpaceHSL}
  ): boolean;
  isChannelPowerless(
    channel: ChannelNameHWB,
    options?: {space: ColorSpaceHWB}
  ): boolean;
  isChannelPowerless(
    channel: ChannelNameLab,
    options?: {space: ColorSpaceLab}
  ): boolean;
  isChannelPowerless(
    channel: ChannelNameLCH,
    options?: {space: ColorSpaceLCH}
  ): boolean;
  isChannelPowerless(
    channel: ChannelNameRGB,
    options?: {space: ColorSpaceRGB}
  ): boolean;
  isChannelPowerless(
    channel: ChannelNameXYZ,
    options?: {space: ColorSpaceXYZ}
  ): boolean;

  /**
   * Returns a color partway between this color and passed `color2`.
   */
  interpolate(options: {color2: SassColor; weight?: number}): SassColor;
  interpolate(options: {
    color2: SassColor;
    weight?: number;
    method?: HueInterpolationMethod;
  }): SassColor;

  /**
   * Changes one or more of this color's channels and returns the result.
   *
   * @throws `Error` if this color is a legacy color space (`rgb`, `hsl`, or
   * `hwb`) and any passed key is not the name of a channel in another legacy
   * color space.
   * @throws `Error` if this color is not a legacy color space and any passed
   * key (other than `alpha`) is not the name of a channel in this color's
   * space.
   */
  change(
    options: {
      [key in ChannelName]?: number | null;
    } & {alpha?: number}
  ): SassColor;

  /**
   * Changes one or more of this color's HSL channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in the HSL color space.
   */
  change(
    options: {
      [key in ChannelNameHSL]?: number | null;
    } & {
      alpha?: number;
      space: ColorSpaceHSL;
    }
  ): SassColor;

  /**
   * Changes one or more of this color's HWB channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in the HWB color space.
   */
  change(
    options: {
      [key in ChannelNameHWB]?: number | null;
    } & {
      alpha?: number;
      space: ColorSpaceHWB;
    }
  ): SassColor;

  /**
   * Changes one or more of this color's Lab channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in the Lab color space.
   */
  change(
    options: {
      [key in ChannelNameLab]?: number | null;
    } & {
      alpha?: number | null;
      space: ColorSpaceLab;
    }
  ): SassColor;

  /**
   * Changes one or more of this color's LCH channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in the LCH color space.
   */
  change(
    options: {
      [key in ChannelNameLCH]?: number | null;
    } & {
      alpha?: number | null;
      space: ColorSpaceLCH;
    }
  ): SassColor;

  /**
   * Changes one or more of this color's RGB channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in an RGB color space.
   */
  change(
    options: {
      [key in ChannelNameRGB]?: number | null;
    } & {
      alpha?: number | null;
      space: ColorSpaceRGB;
    }
  ): SassColor;

  /**
   * Changes one or more of this color's XYZ channels and returns the result.
   *
   * @throws `Error` if any passed key (other than `alpha`) is not the name of a
   * channel in an XYZ color space.
   */
  change(
    options: {
      [key in ChannelNameXYZ]?: number | null;
    } & {
      alpha?: number | null;
      space: ColorSpaceXYZ;
    }
  ): SassColor;

  /**
   * This color's red channel, between `0` and `255`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get red(): number;

  /**
   * This color's green channel, between `0` and `255`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get green(): number;

  /**
   * This color's blue channel, between `0` and `255`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get blue(): number;

  /**
   * This color's hue, between `0` and `360`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get hue(): number;

  /**
   * This color's saturation, between `0` and `100`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get saturation(): number;

  /**
   * This color's lightness, between `0` and `100`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get lightness(): number;

  /**
   * This color's whiteness, between `0` and `100`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get whiteness(): number;

  /**
   * This color's blackness, between `0` and `100`.
   *
   * @deprecated Use {@link channel} instead.
   */
  get blackness(): number;
}

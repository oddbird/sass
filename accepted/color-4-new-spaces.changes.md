## Draft 1.20

* Many small wording and consistency changes.

* Remove outdated references to the possibility of unknown color spaces.

* Remove an outdated reference to the `specified` hue interpolation method.

* Make `color.complement()` and `color.invert()` produce errors when color
  channels are missing, for forwards-compatibility.

* When passing a legacy color to a color manipulation function that operates in
  another space, ensure that channels aren't marked as `none` in the conversion
  back to the legacy color.

* Properly include alpha as the *first* channel in `color.ie-hex-str()` rather
  than the last.

## Draft 1.19

* Be stricter about which colors are allowed with slash-separated strings at the
  end.

## Draft 1.18

* Treat missing channels as distinct from 0 for `==`-equality for colors.

* Convert missing channels to 0 before color conversion for `color.same()`.

* Explicitly support `none` values for `alpha` in Parsing Color Components and
  `color.change()`,

* Clarify how to handle existing missing components in `color.adjust()` and
  `color.scale()`.

* Remove language misleadingly indicating that the scaling a number algorithm
  was guaranteed to return an in-gamut number.

* Ensure that `color.invert()` and `color.grayscale()` always return colors in
  the original color's space.

* Make `color.invert()` throw an error for an invalid `$weight`.

* Include CSS-compatibility behavior for `color.invert()` and
  `color.grayscale()`.

* Explicitly mandate `local-minde` gamut-mapping for `ie-hex-str()`.

## Draft 1.17

* Treat colors with missing channels as the same as 0 for `color.same()`.

## Draft 1.16

* Explicitly require case-sensitivity for channel names in Sass functions.

## Draft 1.15

* Add a mandatory `$method` parameter to `color.to-gamut()` for
  forwards-compatibility with better gamut-mapping algorithms.

* Add `clip` as a gamut-mapping algorithm.

## Draft 1.14

* Update the definition of powerless for HWB to match [the latest CSS
  spec][color-4-changes-20221101].

[color-4-changes-20221101]: https://drafts.csswg.org/css-color-4/#changes-from-20221101

## Draft 1.13

* Remove definitions of powerless channels that are no longer present in CSS
  Color 4.

* Add channel clamping to `color.adjust()`.

* Convert negative saturation/chroma polar colors to their positive equivalents
  on creation.

* Give implementations more flexibility in how they serialize out-of-gamut
  clamped colors.

* Clarify that an error is thrown when passing conflicting legacy channels to
  `color.change()`, `color.adjust()`, and `color.scale()`.

## Draft 1.12

* Explicitly indicate which channels are clamped, and apply this clamping only
  when constructing colors from global functions.

* Serialize colors with out-of-bounds clamped channels so that they parse as the
  correct out-of-gamut value *and* the correct color space, per the spec.

## Draft 1.11

* Add support for the relative color syntax in the algorithm parsing color
  arguments, for CSS compatibility.

## Draft 1.10

* Properly scale `%` return values for `color.channel()`.

* Clean up some language related to percent-conversion.

## Draft 1.9

* Explicitly define associated units for color space channels.

## Draft 1.8

* Require a quoted string for `color.is-missing()` for consistency with other
  color functions and ease of use with channels whose names overlap with colors.

## Draft 1.7

* Resolve missing `alpha` channels *after* premultiplying colors.

## Draft 1.6

* Clarify in the known color space definitions that lightness channels are
  clamped.

## Draft 1.5

* Remove clamping and scaling of `hsl` and `hwb` color channels.

* Document `color.to-gamut()` in summary and design decisions.

## Draft 1.4

* All `lightness` channels are now clamped in the `[0,100]` range.

* Missing channels are not allowed in legacy comma-separated `rgb`/`rgba` or
  `hsl`/`hsla` syntaxes.

* Colors conversion is only performed when necessary. Previously, colors could
  be converted into their current space.

* Color conversion procedure explicitly handles 'carrying forward' missing
  channels when converting to a space with an analogous component. This was
  previously only applied to interpolation.

* Allow all color spaces to be used for hue interpolation.

* Remove `specified` hue interpolation method, and normalize hues to be in the
  `[0,360]` range.

## Draft 1.3

* Deprecate the `color.alpha()` function along with the other legacy channel
  access functions.

* Require quoted strings for channel names in `color.is-powerless()` and
  `color.channel()`, to avoid syntax conflicts between `rgb` channel names and
  their respective named colors (e.g. `'red'` the channel vs `red` the color).

* Define how deprecated functions behave as alias functions during the
  deprecation process.

## Draft 1.2

* Clamp `hsl` saturation & lightness when generating `hsl` colors, and gamut-map
  when converting colors into either `hsl` or `hwb`, since those spaces cannot
  properly maintain out-of-gamut color values.

* Ensure that color space names are unquoted strings, and compared insensitive
  to case.

* Remove support for custom or unknown color spaces. There are too many open
  questions in the CSS spec, as browsers have not started to implement this
  feature yet.

* Remove channel indexing, and syntax to access channels by index, since all
  known color channels have names.

* Allow channel adjustment values to be out-of-gamut, and then normalize the
  resulting channel values. This allows more flexibility, while ensuring that
  `hsl` or `hwb` clamp out-of-gamut results.

* Channel clamping and scaling for `hsl` and `hwb` colors is handled in the
  normalization process, rather than the individual functions. This also allows
  it to happen when normalizing the results of color manipulation.

* Throw an error in the color component parsing procedure if a known color space
  is one of the components, and has a function of it's own (e.g. `rgb` or
  `oklch`). Only custom color spaces and predefined spaces can be defined using
  the `color(<space> <channels>)` syntax.

* Add missing `$weight` to the `color.invert()` signature, and return early
  when the specified weight is `0%` or `100%`.

* Update the color interpolation procedure handling of `weight` values to error
  when `weight` is outside the `[0,1]` range, and return early when `weight` is
  equal to 0 or 1.

* For backwards compatibility, the `color.change()`, `color.scale()`, and
  `color.adjust()` functions allow manipulating legacy colors in any legacy
  space, if the `$space` argument is not explicitly set.

* Remove `in` prefix from the color interpolation method syntax, since the Sass
  function syntax is already explicit about which parameter is where.

* `color.invert()` throws an error when `$weight` would require mixing in an
  invalid `color.mix()` *interpolation color space*.

* Allow scaling channels with a non-0 minimum value, such as the `a` and `b`
  channels in `lab()`/`oklab()`.

* Ensure that percentage and percentage-mapped number values are normalized
  before they are added together in `color.adjust()`.

* Clarify that channel values are stored as raw doubles, and add/remove units
  as necessary for normalization/serialization.

* Legacy colors with missing channels are serialized using the non-legacy
  serialization logic. When converting colors into legacy spaces with
  `color.to-space()`, all missing components are replaced with `0` for better
  legacy output.

* `color.channel()` returns `0` when the channel value is missing, rather than
  throwing an error.

* Added `color.is-missing($color, $channel)` to inspect if a channel is set to
  'none' (e.g. missing).

* Legacy colors using a space-separated syntax with special number values that
  are not adjacent to a `/` symbol are emitted using the legacy
  (comma-separated) CSS syntax. For example:

  * `hsl(20deg 5% var(--foo))` emits `hsl(20deg, 5%, var(--foo))`.

  * `hsl(20deg var(--foo) 5% / 0.5)` emits `hsl(20deg, var(--foo), 5%, 0.5)`.

  * `hsl(20deg 5% var(--foo) / 0.5)` emits `hsl(20deg 5% var(--foo)/0.5)`
    since the special value is adjacent to the slash.

## Draft 1.1

* Expand the summary section to describe more of the proposal.

## Draft 1

* Initial draft

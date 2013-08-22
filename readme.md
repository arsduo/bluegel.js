[![Build
Status](https://travis-ci.org/arsduo/bluegel.js.png?branch=master)](https://travis-ci.org/arsduo/bluegel.js)

BlueGel
=======

_A library to help you develop Javascript-based Leap Motion apps._

The Leap Motion is an exciting, powerful new tool, a device to launch a million
blog posts and HCI papers. The possibilities of gesture-based interaction, as
anyone who's seen a scifi movie or watched a Leap Motion demo can imagine.

We're at the dawn of an exciting new era -- and it's that word, "new", that
brings us here today. As anyone who used the first apps released on the
Airspace store can attest, we still haven't fully figured out the mechanics of
this new paradigm for human-computer interaction. It's like being there when
the first mouse came out, only with a third dimension, ten buttons (at least!),
and a lot more processing power.

Thus, BlueGel: a library to [helps you leap further](http://theportalwiki.com/wiki/Repulsion_Gel).

Goals:
------

BlueGel is designed to make Leap Motion development easier, providing tools
that smooth over some of the rough edges of the SDK and fill in some of the
gaps in the SDK.

* _Additional gestures_: add support for additional gestures, such as Hold or
slow Swipe, to the built-in (fast) Swipe, Circle, ScreenTap, and
KeyTap gestures.
* _Analysis_: provide easy access to frequently-calculated metrics, such as the
dominant direction of a movement.
* _Additional filters_: enhance the built-in filtering (such as "swipe stop",
"circle update"),
making it easier to catch exactly what you want ("stop vertical swipe", "hand
held horizontally for 2 seconds")

On a general level, BlueGel aims to be:

* _Idiomatic_: the library should be easy and natural to use.
* _Reliable_: fully test coverage. Nuff said.
* _Cross-platform_: BlueGel supports both node.js and the browser (using
browserify, etc.). I also want to write an Obj-C version soon :)
* _Useful_: extending the Leap Motion SDK in useful ways based on community
needs.

Examples:
---------

Check out [LeapNoise](https://github.com/arsduo/leapnoise), a simple Leap
Motion app for controlling iTunes, to see BlueGel in action. Once the library
is more stable, I'll provide examples here.

Features:
---------

* _Gesture analysis_: detect primary direction of movement
* _Gesture filter_: eliminate ghost/duplicate events
* _Hold gesture_: track a hand held in place (useful as a trigger, for
instance)


Planned:
--------

* _Slow swipe_: track continuous movement in a single direction too slow for
the built-in Swipe gesture (for instance, controlling the volume by moving your
hand up and down)
* _Directional filters_: identify and respond to movement only in a given
direction
* _Orientation filter_: identify and respond to hands or fingers held in a
certain orientation

Contributing: 
-------------

Suggestions and patches are very welcome! BlueGel is currently based on my own
needs and my analysis of what's challenged existing Leap Motion apps. If you
have ideas or suggestions, let me know (or even better, submit a pull request
with tests).

What else would be useful?

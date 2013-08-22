[![Build
Status](https://travis-ci.org/arsduo/bluegel.js.png?branch=master)](https://travis-ci.org/arsduo/bluegel.js)

BlueGel
=======

_A library to help you develop Javascript-based Leap Motion apps._

The [Leap Motion](http://www.leapmotion.com) is an exciting, powerful new tool, a device to launch a million
blog posts and HCI papers. The possibilities of gesture-based interaction, as
anyone who's seen a scifi movie or watched a Leap Motion demo can imagine.

Being at the dawn of a new era isn't always cream and peaches, though. As anyone who used the first apps released on the
Airspace store can attest, we still haven't figured out the mechanics of
this new paradigm for human-computer interaction. It's like being there when
the first mouse came out, only now with a third axis, ten buttons,
and a lot more processing power.

Thus, BlueGel: a library to [helps you leap further](http://theportalwiki.com/wiki/Repulsion_Gel).

Goals:
------

The raw Leap Motion interface is geared toward the often complex analysis of the stream of motion events, which include both raw location and movement data for hands and fingers and information on gestures like making a circle, swiping quickly, and so on. BlueGel provides a simple layer on top of the Leap library with an emphasis on catching specific, discrete gesture events, smoothing over the rough edges and filling in the gaps in the native SDK:

* _Additional gestures_: add support for additional gestures, such as Hold or
slow Swipe.
* _Analysis_: provide easy access to frequently-calculated metrics, such as the
dominant direction of a movement.
* _Additional filters_: enhance the built-in filtering (such as "swipe stop",
"circle update"),
making it easier to catch exactly what you want ("stop vertical swipe", "hand
held horizontally for 2 seconds")

On a general level, BlueGel aims to be:

* _Idiomatic_: the library should be easy and natural to use.
* _Reliable_: fully test coverage. 'Nuff said.
* _Cross-platform_: BlueGel supports both node.js and the browser (using
browserify, etc.). I also want to write an Obj-C version soon :)
* _Useful_: extending the Leap Motion SDK in useful ways based on community
needs.

The goal of BlueGel is to make it easy to weave a vocabulary of small gestures together into a rich language of gesture-based control.

Get to some code!
-----------------

Meet Allyson. She's a friend of mine, and we're going to write a program for her. Allyson works in a basement office designing educational apps for children; she likes to listen to music as she works, but honestly finds using specialized keyboard buttons just a little, well, very 2004 -- she wants something more newer and more hand-friendly. She also happens to have a Leap Motion...and that's our cue. Let's build her an app to control iTunes!

To start out, we have to instantiate a new BlueGel filter. This hooks into the Leap Motion controller, and lets us respond to events:

```javascript
var controller = new Leap.Controller({enableGestures: true});
var filter = new BlueGel(controller, options);
```

Now we can add event handler to capture the gestures and make the music happen. Allyson has a big music library and skips through songs a lot, so let's let her change tracks simply by swiping from side to side:

```javascript
// supports the built-in swipe, circle, screentap, and keykap gestures
filter.on("swipe", function(gesture) {
  // do something with the gesture
  // this is a LeapMotion Gesture object, 
  // augmented with additional information:
  if (gesture.dominantMovement.direction == "x") {
    changeTrack();
  }
  // it also includes a reference to the original Frame object
  // doSomethingElse(gesture.frame);
})
```

For comparison, here's how you'd do this with the raw LeapMotion SDK:

```javascript
var controller = new Leap.Controller({enableGestures: true});
controller.loop(function(frame) {
  var gesture;
  for (var i = 0; i < frame.gestures.length; i++) {
    gesture = frame.gestures[i];
    if (gesture.type == "swipe") {
      // you'd obviously pull this out into its own function in a real app
      // but you'd still have to think it through and write it out yourself
      var movements = [
        {direction: "x", distance: gesture.position[0] - gesture.startPosition[0]},
        {direction: "y", distance: gesture.position[1] - gesture.startPosition[1]},
        {direction: "z", distance: gesture.position[2] - gesture.startPosition[2]}
      ];

      var dominantMovement = movements.sort(function(a, b) {
        return Math.abs(a.distance) > Math.abs(b.distance) ? -1 : 1
      })[0];
      if (dominantMovement.direction == "x") {
        changeTrack();
      }
    }
  }

  // process other frame-related stuff here in the same function
  if (frame.handIds.length > 0) {
    // etc.
  }
})
```

Hmm. Now we're in user testing and it turns out that Allyson gesticulates a lot while talking, and that keeps making her favorite Andrew Bird/R Kelly mashup skip around. Let's fix that by asking her to hold their hands steady for half a second to unlock control of our app:

```javascript
filter.on("hold", {minDuration: 500}, function(holdGesture) {
  // holdGesture is an object that provides the same data as a LeapMotion Gesture object
  activateControl();
  // make appropriate changes elsewhere
})
```

Pretty neat, right? That's a whole new gesture type, and the first of many.

Allyson may exist only as a composite of people I know, but the program we just built does exist -- check out [LeapNoise](https://github.com/arsduo/leapnoise), a sample Leap Motion app for controlling iTunes, to see BlueGel in action.

Features:
---------

BlueGel is very young and in flux (a little like the Leap Motion itself); there'll be new features and changes frequently 

* _Gesture analysis_: detect primary direction of movement
* _Ghost event filtering_: suppress the duplicate events the SDK seems to fire  
* _Hold gesture_: track a hand held in place (useful as a trigger, for
instance)

All available filters: "swipe", "circle", "screentap", "keytap", "hold", and "frame" (to get every Leap Motion frame)

Planned:
--------

* _Slow swipe_: track continuous movement in a single direction too slow for
the built-in Swipe gesture (for instance, controlling the volume by moving your
hand up and down)
* _Make a fist_: capture a gesture from an open hand to a closed fist
* _Directional filters_: identify and respond to movement only in a given
direction
* _Orientation filter_: identify and respond to hands or fingers held in a
certain orientation

Contributing: 
-------------

Suggestions and patches are very welcome!

BlueGel is tested with Mocha -- if you contribute, please add the appropriate tests in the test folder and ensure everything passes when running `mocha`.

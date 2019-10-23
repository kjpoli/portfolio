## Rotoscoping with Machine Learning

Similar to a bachelor's thesis project, Engineering and Science students at
Stevens produce a year long Senior Design project, typically a startup,
ambitious research project, or most often by partnering with a commercial
client.

Rather than partnering with a client to produce just another app or web service,
I was itching to leverage my resources into the VFX domain, and pitched my own
project and formed a team to support me. Together, we designed Telescope, a
machine learning solution to partially automate the roto process, with a focus
on delivering powerful tools rather than a black box solution. As such we also
created a complimentary Nuke plugin to implement the tools that interface with
the network. We recieved guidance and computing power support from our Visual Arts and Technology
department and the newly created Intstitute for AI, as well as support in the
form of an ambitious dataset from NVIDIA, which was crucial to our work.

### Workflow and Dataset
The idea behind telescope is that we can allow artists to make rough, quick
selections and have our ML algorithm zero in on all of the important details,
saving them the time of painstakingly managing many curves and control points.


<div style="display: block">
<img src="https://lh6.googleusercontent.com/amLQQtrfqldoeprxGLRiMBbhoJxl8YcGmNdCX1_wBPQlAgdyq4z68cb-QwmsEvI3wF3J7eQDTLbCCbYw89qeaAu10OBIyFpZYD3Jz753" width="20%" />
<img
src="https://lh5.googleusercontent.com/O-Gqo4v5nlLckat5gFvaa2i00jeGLBlzkmM5E4K8mePbUg_CXvayisg9AlZwjknZK718n6PoU7dIBKJZee45DH1eFQnQOP8NgyeNdMum"
width="20%" />
</div>

here is an example of a selection I made in my movie Knife Man, where I just
clicked around the edges.



piping this selection into the Telescope node in Nuke returns a single channel
image called a TriMap, which is white in the 'certain' reigon, black in reigon
known to be out of the selection, and gray is the area where we cant be sure and
need to defer to the AI. The uncertain reigon can be quite large as seen in this
demonstration of the training set


<img src="http://pfgallery-ebb6.kxcdn.com/dataset.png" width="80%" />

We recieved this dataset from NVIDIA researchers, and compiled it for use in our
project. The concept is that we have a number of background images and a number
of greenscreened subjects. Having keyed the subjects already, we have access to
the ground truth alpha matte. We then concatenate all possible combinations of
subjects and backgrounds and use them to train the network, making it possible
to extract subjects from many backgrounds. To extract TriMaps for use in the
training process, we dilate the edges of the ground truth alpha matte.

The network takes as input our RGB
image and a single channel trimap, and outputs a single channel alpha matte.
- this means there is an astounding number of input features
  - for 320x320 images: `4*( 320 * 320 ) = 409600`
  - in early stages we trained on a GTX 1080 Ti, but eventually moved to GPUs
    from Amazon AWS 

### Network and Training

Telescope itself is a Convolutional Neural Network written in PyTorch, a popular
and cutting edge machine learning library. It is essentially two chained
encoder-decoder networks, one initial pass and a matte refinement network.


<img class="invert"
src="https://www.analyticsindiamag.com/wp-content/uploads/2018/08/arch-como-en-de2.png"
width="100%" />

Because of the precision required, we trained the model with stochastic gradient
descent once computing power became abundant.
- **Gradient Descent:** We specify Loss functions that are differentiable with
  respect to the neural network. We update the weights of the neural network by
  following the gradient of the Loss functions to find a minimum.
  
  - **Alpha Loss:** This is the squared error between the pixels of the predicted
    alpha matte and the ground-truth alpha matte.
    
  - **Compositional Loss:** We use the predicted and ground-truth alpha mattes to
    composite the subject on a different background and calculate the pixel-wise
    squared error between the two composites.
    

<img class="invert" src="https://lh4.googleusercontent.com/ASmIBYLd7IH9xlLGWjIUA-2_Q-rnE_e9eRCTgl9RxC9oGIAnmh8-Qj-a6pT5YF0tKc_LDBzr3j7o1q80IkNEmVB3oTTwZsgnqnDihb9N" width="60%" />

- alpha loss in gray, compositional loss in pink.

### Nuke Plugin implementation

For speed, our plugin uses the C++ API, as opposed to Python scripting. This can
seem counterintuitive as our network is written in Python, but, the extra steps
for performance are more than worth it in processing a video. As such we
'productionized' to deploy the model to a separate minimal C++ code thats both
smaller on client machines and significantly faster. For namespace and safety
reasons it is not merely slapped into our plugin, but called from the outside
using an `execvp()` system call on Unix-like machines.

[For more information on C++ production machine learning models](https://medium.com/datadriveninvestor/deploy-your-pytorch-model-to-production-f69460192217)

Performance wise, Nuke processes images row by row, and our model requires the
fully feature images, as such, we cannot take advantage of Nuke's innate
multithreading. At the end of our project, we began implementing POSIX threats
to divide and conquer the video.

### Innovation Expo Presentation
For the annual Innovation Expo, where students exhibit their projects to the
community, faculty and investors, we created an infographic trifold, and a
realtime demo - involving a similar realtime body segmentation model hooked up
to a CRT TV. Passers by could see themselves roughly roto'd out in real time.

A Better view and a link to download our infographic is available on my `resume`
page

<img src="http://pfgallery-ebb6.kxcdn.com/trifold.png" width="50%" />

## Lockpicking Unity Game

<iframe src="https://player.vimeo.com/video/368084737" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
 
<p> 
After bouncing back between code projects and 3D projects, I wanted to hunker
down and try something out with a nice mix of scripting and 3d work, and if I
could fit in some math, I thought it would be great. I settled on recreating
the iconic lockpicking minigame from Fallout 3, which I think is the
definitive video game lockpick if only because of its intuitive nature. here
is a video in action before I get to the finer points The process was fairly
simple but had a fair amount of legwork
</p> 

- cook up models and materials for lock, paperclip and screwdriver
  - Substance Designer made it easy to build in Blender and test in Unity
  - During this time I also voronoi shattered the pick for a nice effect, in
      the original game, the picks simply disappear
- refine my existing HLSL shaders for a stylish look (see more)
- Game Logic 
  - The game is fairly simple, constrain a pick to a 180 degree reigon with a
      randomly generated 'sweet spot' of a reasonable length. The closer the
      pick gets to the sweet spot, the more the lock is allowed to rotate. Once
      the lock is stuck while rotating, we erode the health of the pick
      
### Measuring Success 

```csharp
float success(){
        float distance = 0;
            if(pickedAngle < hitzone.x){
                distance = Mathf.Abs(pickedAngle - hitzone.x);
            }
            else if ( pickedAngle > hitzone.y ) {
                distance =  Mathf.Abs(pickedAngle - hitzone.y);
            } else pick.GetComponent<pick>().shake = false;
            return Mathf.Clamp( (180 - (distance * difficulty) )/180, 0, 1) ;
        }
```
as properties in the `GameObject` that controlls the game, we set a vector
for the minimum and maximum angle, where the interior is the sweet spot.
hitzone.x and y are merely arbitrary vector components and not to be taken as
actual x and y rotations, the pick is constrained to only rotate on the `z
axis`. the `difficulty` float property makes the game more punishing by
contracting the reigon that the lock will rotate at all.

By dividing this distance by 180, we get essentially a percentage of how close
we are to hitting the sweet spot, we then allow the lock to turn that percentage
of the way to 90 degrees where success happens.
```csharp
if (curRot.z >= success*maxZ-0.5 && curRot.z < 89) {
                pick.GetComponent<Pick>().shake = true;
             ...
```

The shake routine both vibrates the model of the lockpick and erodes its health.
we subtract 0.5 as the pick is allowed to rotate `-90->+90`, but the lock can only
go `0->90`, arbitrating that mathematical head start;

```csharp
  if(shake){
            health -= 1;
            if(health < 1){
                foreach(Renderer chld in shattered.GetComponentsInChildren<Renderer>())
                    chld.enabled = true;
                shattered.GetComponent<ParentConstraint>().enabled = false;
                foreach(Rigidbody chld in shattered.GetComponentsInChildren<Rigidbody>())
                    chld.isKinematic = false;
                self.SetActive(false);
            }
            healthBar.value = health;
            transform.Rotate(Mathf.Sin(Time.time * shakespeed) * shakeamount, 0,Mathf.Sin(Time.time * shakespeed) * shakeamount);
        }
```

and here's the shake routine, with the case that enables each of the shattered
pieces and activates their physics, which are preloaded with some minute
velocity and torque to make the shattered pieces come apart nicely
### HLSL Toon Shaders
<iframe style="margin: 10px; border-radius: 15px;" src="https://player.vimeo.com/video/367527235" width="320" height="278" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


I make a lot of nice little 3D comic book scenes with models I can find from
video games. I love experimenting with non-photorealistic rendering techniques,
but quite a few popular solutions I find lacking for the general case in a few
key ways
- many require atypical lighting setups
  - like extremely bright lights 
  - worst case may require a single directional 'sun'
- many require fixed colors or few tones per surface
- most importantly, I couldnt find any shaders that took full advantage of PBR
  qualities like Metallic-ness, Roughness, Normal, Subsurface Scattering etc.
A toon shader that takes all of this input into account can benefit from a
  seriously expedited look development process.


#### Identifying The Toon look

to figure out what exactly makes our characters look sufficiently comic-like and
tooned, lets start with link.

<img src="https://giantbomb1.cbsistatic.com/uploads/scale_medium/0/4882/190171-1040478200200212219.jpg" width="30%" />

Link seems to have limited 'cels' of shadowed and unshadowed sections, no smooth
gradients, and many stylistic choices in his modeling and texturing. Watching
some gameplay, relative brightness and darkness, as well as tinting of the
highlights and shadows seems to be area dependent and not dynamic, this can be a
great area of improvement

I found it helpful to think about this in the `HSL colorspace` as opposed to RGB,
that is colors having components of Hue, Saturation and Value. Notably, that on
link there are many hues, many saturations (just look at his boots), but only
few values (light and dark). As such I created a function in HLSL that fits a
value to the closest of a few predetermined values

```glsl
half fitToRamp(half val){
            //represents a constant gradient ramp
            // each row being a vector of
            static uint pins = 4;
            static matrix <fixed, 4, 2 > ramp = {
                0.0, 0.0,
                0.2, 0.063,
                0.5, 0.152,
                1.0, 0.259
            };
            for(uint i = 0; i < pins; ++i){
                if(!(val > ramp[i][1])) return saturate(val * ramp[i][0]);
            }
            return 1;
        }
``` 

the key is the 4x2 matrix, the values on the right being the real values as
calculated at the `finalcolor` step of the Unity Surface Shader, that is, the
screen space composite of the shaded object that is the final step of shading an
object.

The values on the left are multiplied to the unlit textured composite based on
the values on the right calculated by a normal PBR surface. This means that we
can expect the brightest parts of an image to resemble the unlit texture, and
lower ones to be dimmed.

<img src="http://pfgallery-ebb6.kxcdn.com/pool.png" width="50%" />

I cooked up a test scene in Blender with some video game models intended to be
photorealistic, so we can see how a shader alone can change our look; From that,
we got thick black inked-style shadows, and 'cels' of color with more complex borders
than traditional cel shading allows. These borders can be informed by normal
maps and other PBR material characteristics. Jason's spear and machete are
dynamic and metallic, and react to light in predictable ways. Overall, plugging
and chugging this shader with realistic assets really does go a long way in
transforming the scene.

Going the next step for an even toonier look can be 
- vector tracing the textures and maps in Illustrator or Inkscape
- manually adding some hand drawn lines with texture painting

or programming a quick outline subshader 
```glsl
//linear expansion of each vertex 
v2f vert(appdata_full data) {
            return data.vertex + (normalize(data.normal) * _OutlineSize);
        }
```

with float property `_OutlineSize`, and an `Emission` channel output of the
desired outline color. Make sure to add `Cull Front` just before the opening
`CGPROGRAM` of the subshader

For information about changing the thickness of hand drawn lines based on the
position of the camera, check out [this
resource](https://www.artstation.com/artwork/ow9Xq) from technical artist Nara
Ken, and his beautiful results recreating the artwork of Hellboy illustrator
Mike Mignola

#### Bonus - GPU colorspace conversion code
ported from a similar example in GLSL
- *NOTE*, because shaders are often expected to be compiled quickly in the
realtime context of a game, optimizations by the compiler are very minimal and
can lead to some quirks like the `?` operator being faster than `if` statements
in many cases.
```glsl
half3 rgb2hsv(half3 c){
        half4 K = half4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        half4 p = c.g < c.b ? half4(c.bg, K.wz) : half4(c.gb, K.xy);
        half4 q = c.r < p.x ? half4(p.xyw, c.r) : half4(c.r, p.yzx);

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return half3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e),q.x);
}

half3 hsv2rgb(half3 c){
    static half4 K = half4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    half3 p = abs(frac(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * lerp(K.xxx, saturate(p - K.xxx), c.y);
}
```


export const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const fragmentShader = `
  precision highp float;
  uniform vec2 uResolution;
  uniform vec2 uRotation;
  uniform vec2 uFlow;
  uniform vec4 uNodes[6];
  uniform vec4 uStructure;
  uniform vec4 uMode;
  uniform vec4 uSymbol;
  uniform float uIntent;
  uniform float uTime;
  uniform float uFraming;
  uniform float uOpen;
  uniform float uEyeOpen;
  uniform float uBloom;
  uniform float uPulse;
  uniform float uEnergy;
  varying vec2 vUv;

  mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
  float smin(float a, float b, float k) {
    float h = clamp(.5 + .5 * (b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
  }
  vec3 local(vec3 p) {
    p.xy -= uFlow * (.25 + .35 * exp(-dot(p,p) * .4));
    p.xz = rot(uRotation.x) * p.xz;
    p.yz = rot(uRotation.y) * p.yz;
    p.xz = rot(p.y * (.22 * sin(uTime*.19) + uBloom*.6)) * p.xz;
    p += .16 * sin(p.zxy * 1.55 + vec3(uTime*.43, -uTime*.31, uTime*.37));
    return p;
  }
  float capsule(vec3 p, vec3 a, vec3 b, float radius) {
    vec3 pa = p-a;
    vec3 ba = b-a;
    return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0))-radius;
  }
  float symbols(vec3 world) {
    vec3 p = world;
    p.xz = rot(.14*sin(uTime*.42)) * p.xz;
    p.yz = rot(.08*cos(uTime*.36)) * p.yz;
    p.y -= .035*sin(uTime*1.2);
    p.z += .055*sin(p.x*2.0+p.y+uTime*.8);
    // Code: a pair of open brackets and a forward slash.
    vec3 bracket = vec3(abs(p.x),p.y,p.z);
    float code = smin(capsule(bracket,vec3(.9,1.0,0),vec3(1.7,0,0),.15),capsule(bracket,vec3(1.7,0,0),vec3(.9,-1.0,0),.15),.10);
    code = min(code,capsule(p,vec3(.28,1.14,0),vec3(-.28,-1.14,0),.11));
    // Music: a breathing waveform, with independently flowing amplitudes.
    float music = 10.0;
    for (int i=0; i<7; i++) {
      float f = float(i)-3.0;
      float height = .28 + .78*exp(-f*f*.18) + .16*sin(uTime*2.3+f*.9);
      music = min(music,capsule(p,vec3(f*.45,-height,0),vec3(f*.45,height,0),.115));
    }
    // Imagery: eyelids close over the iris while the eye corners stay fixed.
    float lidX = clamp(p.x,-1.545,1.545);
    float arc = sqrt(max(1.68*1.68-lidX*lidX,.66*.66));
    float lidHeight = (arc-.66)*uEyeOpen;
    float crease = -.08*(1.0-uEyeOpen)*(1.0-lidX*lidX/(1.545*1.545));
    float slope = uEyeOpen*lidX/arc;
    float lidDistance = (abs(p.y-crease)-lidHeight)/sqrt(1.0+slope*slope);
    float eye = length(vec3(p.x-lidX,lidDistance,p.z))-.12;
    vec3 iris = p-vec3(.10*sin(uTime*.55),.035*cos(uTime*.7),0);
    float irisShape = max(length(iris)-.43,abs(p.y-crease)-lidHeight+.10);
    eye = min(eye,irisShape);
    // Words: two sculpted quotation marks.
    vec3 q = p / 1.65;
    q.x += q.x < 0.0 ? .61 : -.61;
    float words = length(q-vec3(0,.38,0))-.33;
    words = smin(words,capsule(q,vec3(.14,.13,0),vec3(.02,-.28,0),.18),.16);
    words = smin(words,capsule(q,vec3(.02,-.28,0),vec3(-.29,-.59,0),.12),.14);
    return code*uSymbol.x+music*uSymbol.y+eye*uSymbol.z+words*1.65*uSymbol.w;
  }
  float field(vec3 world) {
    if (uIntent > .999) return symbols(world);
    vec3 p = local(world);
    float envelope = 10.0;
    for (int i=0; i<6; i++) {
      float f = float(i);
      vec4 node = uNodes[i];
      vec3 center = node.xyz * (1.0 + uOpen*.22);
      center += .12 * sin(vec3(f*1.9, f*2.7, f*3.1) + uTime * vec3(.57,.43,.39));
      center.y += uBloom * sin(f*2.4 + uTime*.7) * .23;
      float radius = node.w * (1.0 + .075*sin(uTime*1.3+f));
      envelope = smin(envelope, length(p-center)-radius, uStructure.w);
    }
    float frequency = uStructure.x - uOpen*.45;
    vec3 q = p * frequency;
    q += vec3(uTime*.12, -uTime*.17, uTime*.09);
    // Two minimal-surface fields merge continuously. Tunnels grow, close and
    // reconnect inside a separately evolving outer body; there are no strips.
    float gyroid = dot(sin(q), cos(q.zxy));
    float cells = cos(q.x) + cos(q.y) + cos(q.z);
    float membrane = mix(gyroid, cells, uStructure.y);
    membrane += .24 * sin(q.y*.8 + q.x*.7 + uTime*.5);
    float ripple = uEnergy * exp(-uPulse*1.3) * sin(length(p)*7.0-uPulse*8.0);
    float thickness = uStructure.z + uOpen*.025 + ripple*.035;
    float porous = abs(membrane) / (frequency * 1.8) - thickness;
    // A smooth intersection rounds the edges where the membrane meets the skin.
    float body = -smin(-envelope, -porous, .12);
    return uIntent < .001 ? body : mix(body,symbols(world),uIntent);
  }
  vec3 normalAt(vec3 p) {
    vec2 e = vec2(.0035, 0.0);
    return normalize(vec3(field(p+e.xyy)-field(p-e.xyy), field(p+e.yxy)-field(p-e.yxy), field(p+e.yyx)-field(p-e.yyx)));
  }
  void main() {
    vec2 uv = (vUv-.5) * vec2(uResolution.x/uResolution.y,1.0);
    float framing = uFraming;
    framing *= max(1.0, .98*uResolution.y/uResolution.x);
    vec3 ro = vec3(0.0,0.0,8.0);
    vec3 rd = normalize(vec3(uv*framing,-8.0));
    float distance = 0.0;
    bool hit = false;
    float b = dot(ro,rd);
    float bound = b*b-dot(ro,ro)+20.25;
    if (bound > 0.0) {
      distance = max(0.0,-b-sqrt(bound));
      for (int i=0; i<144; i++) {
        float h = field(ro+rd*distance);
        if (h < .002 + distance*.00025) { hit=true; break; }
        distance += max(h*.65,.001);
        if (distance > 12.6) break;
      }
    }
    if (!hit) {
      float section = field(vec3(uv*framing,0.0));
      float contour = section*2.4;
      float ink = 1.0-smoothstep(.012,.028,abs(fract(contour)-.5));
      float fade = smoothstep(.12,.4,section)*exp(-max(section,0.0)*1.4);
      gl_FragColor = vec4(mix(vec3(.40,.49,.75),vec3(.68,.40,.60),.5+.5*sin(contour*.7+uTime*.12)),ink*fade*(.16+uOpen*.13));
      return;
    }
    vec3 p = ro+rd*distance;
    vec3 n = normalAt(p);
    vec3 eye = -rd;
    float facing = max(dot(n,eye),0.0);
    float rim = pow(1.0-facing,2.3);
    float light = max(dot(n,normalize(vec3(-.7,1.0,1.8))),0.0);
    float fill = max(dot(n,normalize(vec3(.9,-.3,.6))),0.0);
    float ao = clamp(field(p+n*.16)/.16,0.0,1.0);
    float deepAo = clamp(field(p+n*.38)/.38,0.0,1.0);
    vec3 organic = local(p);
    float hue = .5 + .5*sin(organic.y*1.0+organic.z*.8+uTime*.11);
    float iridescence = .5+.5*sin(facing*4.0 + organic.x*.7 + uMode.y*.7 + uMode.z*1.2);
    vec3 blue = vec3(.30,.48,.94);
    vec3 rose = vec3(.94,.35,.60);
    vec3 violet = vec3(.61,.38,.94);
    vec3 gold = vec3(.98,.66,.30);
    vec3 spectrum = mix(blue,violet,hue);
    spectrum = mix(spectrum,rose,smoothstep(.30,.90,iridescence));
    spectrum = mix(spectrum,gold,smoothstep(.72,1.0,hue)*(.3+.4*iridescence));
    vec3 sectionColor = blue*uMode.x+rose*uMode.y+violet*uMode.z+gold*uMode.w;
    vec3 albedo = mix(spectrum,sectionColor,uIntent*.58);
    albedo = mix(albedo,vec3(.87,.90,.96),.18);
    float irisMask = (1.0-smoothstep(.40,.46,length(p.xy))) * uSymbol.z*uIntent*smoothstep(.12,.45,uEyeOpen);
    albedo = mix(albedo,vec3(.15,.25,.49),irisMask*.9);
    vec3 color = albedo*(.24+light*.73+fill*.16);
    color *= .6+.25*ao+.15*deepAo;
    // Soft transmission at thin edges, without mirror-like environment reflections.
    color += mix(vec3(.28,.47,.74),vec3(.67,.35,.57),hue)*rim*.4;
    color += vec3(.63,.8,1.0)*pow(max(dot(n,normalize(eye+vec3(-.4,1.0,1.4))),0.0),28.0)*.18;
    color += vec3(.65,.32,.44)*uOpen*rim*.25;
    color = pow(color,vec3(.87));
    gl_FragColor = vec4(color,1.0);
  }
`;

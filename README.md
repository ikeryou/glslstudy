# glslstudy
Study GLSL

https://wgld.org/d/glsl/g001.html


## gl_FragCoord
処理する対象となるピクセルの位置がそのままピクセル単位で入っている

## 集中線のコード
```
float t = atan(p.y, p.x) + time;
t = sin(t * 10.0);
```

## 波打つ線
```
float u = sin((atan(p.y, p.x) + time * 0.5) * 20.0) * 0.01;
float t = 0.01 / abs(0.5 + u - length(p));
```
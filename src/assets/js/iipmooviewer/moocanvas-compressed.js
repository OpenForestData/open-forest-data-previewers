//MooCanvas, My Object Oriented Canvas Element. Copyright (c) 2008 Olmo Maldonado, <http://ibolmo.com/>, MIT Style License.
eval(
  (function (p, a, c, k, e, d) {
    e = function (c) {
      return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };
    if (!''.replace(/^/, String)) {
      while (c--) {
        d[e(c)] = k[c] || e(c);
      }
      k = [
        function (e) {
          return d[e];
        },
      ];
      e = function () {
        return '\\w+';
      };
      c = 1;
    }
    while (c--) {
      if (k[c]) {
        p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
      }
    }
    return p;
  })(
    "9(2C.2B.2D){1U.2E.I=5(K){q L 1K(K)};1I.2F().2A='I {2z-2u:2t;2v:2w-2y;}'+'I T, I T * {2x:2G;2H:2Q;}'+'I T * {z:1J;t:1J;}'+'v\\\\:*, o\\\\:*{2R:2S(#2T#2O)}'}6 1K=L 1N({1T:5(){6 11=2J.2I(2K,{1L:2L.S,J:$2s});6 K=$2U({z:2r,t:2b},11.1L);6 g=(11.J||1I.2c('I')).29(K);9(g.16)q g;g.1H('2e',4.1F);g.1H('2f',4.1G);g.16=5(){q 4.1E=4.1E||L U(g)};q g.1S({z:K.z,t:K.t})},1F:5(e){6 P=e.26;9(P=='z'||P=='t'){e=e.1M;e.1c[P]=e[P];e.16().1R()}},1G:5(e){e=e.1M;6 V=e.2d;9(V){V.1c.z=e.z;V.1c.t=e.t}}});6 U=L 1N({1T:5(g){4.J=L 1U('T').1S({z:g.2q,t:g.2l}).2h(g);4.m=[[1,0,0],[0,1,0],[0,0,1]];4.l=0;4.19=0;4.2V=[];4.f=[];4.Z=10;4.7=4.Z/2;4.1C=1;4.1u=1;4.O=0;4.R=0;4.2j=4.Z*1},1Q:1,1x:'#1O',1w:'#2k',1Z:1,2M:'33-3y',15:'1X',21:'3x',3z:0,3A:'#1O',3u:0,3p:0,1s:5(x,y){6 m=4.m,Z=4.Z,7=4.7;q[Z*(x*m[0][0]+y*m[1][0]+m[2][0])-7,Z*(x*m[0][1]+y*m[1][1]+m[2][1])-7]}});U.1V({23:5(){4.l=0;4.f.1o=0},1y:5(x,y){4.f[4.l++]='m';4.f[4.l++]=4.s(x,y);4.O=x;4.R=y},1v:5(){4.f[4.l++]='x'},C:5(x,y){4.f[4.l++]='l';4.f[4.l++]=4.s(x,y);4.O=x;4.R=y},3n:5(1P,1D,x,y){6 18=2*1P,1a=2*1D;4.1A((18+4.O)/3,(1a+4.R)/3,(18+x)/3,(1a+y)/3,x,y)},1A:5(1p,1q,1r,1W,x,y){4.f[4.l++]=' c '+[4.s(1p,1q),4.s(1r,1W),4.s(x,y)].F(',');4.O=x;4.R=y},3l:14.12,34:5(x,y,p,u,H,N){9(4.19===0)p*=4.Z;6 M=u.1b()*p,1g=u.1f()*p,X=H.1b()*p,1h=H.1f()*p;9(4.19!==0){6 G=1B.G,17=G/24,n=(N)?-1:1;9(n*H<u)(N)?u+=2*G:H+=2*G;4.C(M+x,1g+y);3m(n*u+17<H)4.C(x+(u+=n*17).1b()*p,y+u.1f()*p);4.C(X+x,1h+y);q}9(M==X&&!N)M+=0.31;6 7=4.7,c=4.1s(x,y),1e=4.1C*p,1d=4.1u*p;4.f[4.l++]=[N?'2Z ':'30 ',(c[0]-1e).D()+','+(c[1]-1d).D()+' ',(c[0]+1e).D()+','+(c[1]+1d).D()+' ',4.s(M+x-7,1g+y-7)+' ',4.s(X+x-7,1h+y-7),].F('')},1j:5(x,y,w,h){4.1y(x,y);4.C(x+w,y);4.C(x+w,y+h);4.C(x,y+h);4.1v()},r:5(){4.W(3b)},W:5(r){9(!4.f.1o)q;6 13=4.Z*10,Q=4.1w,Y=3a.S(Q),b=4.20(r&&Y?Q:4.1x),a=(r)?['3d=',['<v:r ',!Y?4.25(Q):'b='+b.b+' A=\"'+b.A,'\"></v:r>']]:['3e='+0.8*4.1Q*4.m[0][0]+' 2i=',['<v:W','3c=',(4.15=='1X')?'3f':4.15,'3h=',4.21,'b=',b.b,'A=\"',b.A,'\" />']];4.J.39('2W',['<v:1Y f=\"',4.f.F(''),'e\" 32=\"'+13+','+13+'\" ',a[0],'22\">',a[1].F(' '),'</v:1Y>'].F(''));9(r&&Q.1m)4.J.3o().r.3q=22;4.23()},3t:14.12,3s:14.12,20:5(B){6 a=4.1Z;9(B.2p(0,3)=='Y'){9(B.2o(3)==\"a\")a*=B.27(/([\\d.]*)\\)$/)[1];B=B.28()}q{b:B,A:a}},25:5(k){6 1n='';9(k.2a){6 1i=k.2N,1l=k.2P,E='';9(k.E)3v(6 i=0,j=k.E.1o;i<j;i++)E+=(1k*k.E[i][0]).D()+'% '+k.E[i][1];1n+=((k.3w)?'S=3r 3B=\"0.2,0.2\" 37=\"0.2,0.2\"':'S=2X 3k=3g 3j=0 1z='+3i*(1+k.1z/1B.G)+' ')+['b=\"'+1i.b,'A=\"'+1i.A*1k+'%','38=\"'+1l.b,'o:2Y=\"'+1l.A*1k+'%','36=\"'+E].F('\" ')}q(k.1m)?'S=\"35\" 1t=\"'+k.1m.1t:1n},s:5(x,y){6 m=4.m,Z=4.Z,7=4.7;q(Z*(x*m[0][0]+y*m[1][0]+m[2][0])-7).D()+','+(Z*(x*m[0][1]+y*m[1][1]+m[2][1])-7).D()}});U.1V({1R:5(x,y,w,h){4.J.2m='';4.m=[[1,0,0],[0,1,0],[0,0,1]]},2n:5(x,y,w,h){4.1j(x,y,w,h);4.r()},2g:5(x,y,w,h){4.1j(x,y,w,h);4.W()}});",
    62,
    224,
    '||||this|function|var|Z2||if||color||||path|el||||obj|||||rad|return|fill|coord|height|a0|||||width|opacity|col|lineTo|round|stops|join|PI|a1|canvas|element|props|new|x0|cw|currentX|property|fS|currentY|type|div|CanvasRenderingContext2D|efC|stroke|x1|rgb|||params|empty|size|Function|lineCap|getContext|da|cx|rot|cy|cos|style|aSYr|aSXr|sin|y0|y1|oc0|rect|100|oc1|img|ret|length|cp0x|cp0y|cp1x|getCoords|src|arcScaleY|closePath|fillStyle|strokeStyle|moveTo|angle|bezierCurveTo|Math|arcScaleX|cpy|context|changeproperty|resize|attachEvent|document|10px|Canvas|properties|srcElement|Class|000|cpx|lineWidth|clearRect|setStyles|initialize|Element|implement|cp1y|butt|shape|globalAlpha|processColor|lineJoin|false|beginPath||processColorObject|propertyName|match|rgbToHex|set|addColorStop|150|newElement|firstChild|onpropertychange|onresize|strokeRect|inject|filled|miterLimit|fff|clientHeight|innerHTML|fillRect|charAt|substr|clientWidth|300|defined|left|align|display|inline|position|block|text|cssText|Engine|Browser|trident|Constructors|createStyleSheet|absolute|overflow|link|Array|arguments|Object|globalCompositeOperation|col0|VML|col1|hidden|behavior|url|default|extend|state|beforeEnd|gradient|opacity2|at|wa|125|coordsize|source|arc|tile|colors|focussize|color2|insertAdjacentHTML|String|true|endcap|stroked|strokeweight|flat|linear|joinstyle|180|focus|method|arcTo|while|quadraticCurveTo|getLast|shadowOffsetY|alignshape|gradientradial|isPointInPath|clip|shadowOffsetX|for|r0|miter|over|shadowBlur|shadowColor|focusposition'.split(
      '|'
    ),
    0,
    {}
  )
);

const Hexo = require('hexo')

const hexo = new Hexo(process.cwd(), {})

const bootstrap = async () => {
  await hexo.init()
  await hexo.load()

  hexo.extend.injector.register('head_end', () => {
    return `
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "lbt0m726h2");
</script>
`
  })

  await hexo.call('generate')
}

bootstrap()

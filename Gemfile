source "https://rubygems.org"

# GitHub Pages gem incluye Jekyll y dependencias compatibles
gem "github-pages", group: :jekyll_plugins

# Plugins adicionales
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Windows y JRuby
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance booster para watching directories on Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

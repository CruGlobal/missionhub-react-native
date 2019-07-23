# From https://stackoverflow.com/a/23760820/665224

Pod::Spec.new do |s| 
  s.name           = 'AdobeMobileLibrary'
  s.version        = '4.13.8'
  s.license        = 'Commercial'
  s.summary        = 'Adobe Omniture SiteCatalyst analytics library for iOS.'
  s.homepage       = 'https://developer.omniture.com/en_US/content_page/mobile/c-measuring-   mobile-applications'
  s.author         = { 'Adobe Omniture SiteCatalyst' => 'http://www.adobe.com/solutions/digital-marketing.html' }
  s.source         = { :http => '' } # Ignored locally but needed for validation
  s.source_files   = '*.h'
  s.resource       = 'ADBMobileConfig.json'
  s.framework      = 'SystemConfiguration'
  s.preserve_paths = 'libAdobeMobileLibrary.a'
  s.ios.vendored_library = 'AdobeMobileLibrary.a'
  s.prepare_command  = <<-CMD
             if [ -f $PWD/libAdobeMobileLibrary.a ]
             then
                 rm -rf $PWD/libAdobeMobileLibrary.a
             fi
             ln -s $PWD/AdobeMobileLibrary.a $PWD/libAdobeMobileLibrary.a
                          CMD
  s.libraries      = 'sqlite3.0'
  s.xcconfig       = { 'LIBRARY_SEARCH_PATHS' => '"$(PODS_ROOT)"' }
end
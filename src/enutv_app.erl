-module(enutv_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
	Dispatch = cowboy_router:compile([
		{'_',[
				{"/api/news/top5", news_top5_handler, []},     
                {"/n/:id", news_page_handler, []},                      
				{"/css/[...]", cowboy_static, 
					[
                		{directory, {priv_dir, enutv, ["public/css"]}},
                		{mimetypes, {fun mimetypes:path_to_mimes/2, default}}
            		]
            	},
                
                {"/images/[...]", cowboy_static, 
                    [
                        {directory, {priv_dir, enutv, ["public/images"]}},
                        {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
                    ]
                },
                {"/js/[...]", cowboy_static, 
                    [
                        {directory, {priv_dir, enutv, ["public/js"]}},
                        {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
                    ]
                },
                {"/players/[...]", cowboy_static, 
                    [
                        {directory, {priv_dir, enutv, ["public/players"]}},
                        {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
                    ]
                },
            	{"/", cowboy_static, 
            		[
                		{directory, {priv_dir, enutv, ["public"]}},
                		{file, "index.html"},
                		{mimetypes, {fun mimetypes:path_to_mimes/2, default}}
            		]
            	}
                
			 ]
		}

	]), 
    ok = application:start(lager),
    ok = application:start(crypto),
    ok = application:start(jsx),
    ok = application:start(cowlib),
    ok = application:start(ranch),
    ok = application:start(cowboy),
    ok = application:start(ibrowse),

	{ok, _} = cowboy:start_http(http,100, [{port, 9902}],[{env, [{dispatch, Dispatch}]},
                                                          {onresponse, fun error_hook_responder:respond/4}
              ]), 
    enutv_sup:start_link().

stop(_State) ->
    ok.

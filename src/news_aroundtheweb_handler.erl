-module(news_aroundtheweb_handler).
-author("shree@ybrantdigital.com").

-export([init/3]).

-export([content_types_provided/2]).
-export([welcome/2]).
-export([terminate/3]).

%% Init
init(_Transport, _Req, []) ->
	{upgrade, protocol, cowboy_rest}.

%% Callbacks
content_types_provided(Req, State) ->
	{[		
		{<<"application/json">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	{Count, NewsCount} = cowboy_req:qs_val(<<"n">>, Req),
	lager:info("Top News requested"),
	Url = enutv_util:news_around_the_web(binary_to_list(Count)),
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Body = list_to_binary(Res),
	{Body, Req, State}.


-module(news_topnews_handler).
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
	{Count, _ } = cowboy_req:qs_val(<<"n">>, Req),
	{Category, _ } = cowboy_req:qs_val(<<"c">>, Req),
	lager:info("Top 10 News items requested"),
	Url = case binary_to_list(Category) of 
		"World" ->
			%Category = "US",
			enutv_util:news_top_text_news_with_limit("world_news",binary_to_list(Count));
		"US" ->
			%Category = "US",
			enutv_util:news_top_text_news_with_limit("us_news",binary_to_list(Count));
			
		"Politics" ->
			%Category = "Politics",
			enutv_util:news_top_text_news_with_limit("us_politics",binary_to_list(Count));
			
		"Entertainment" ->
			%Category = "Entertainment",
			enutv_util:news_top_text_news_with_limit("us_entertainment",binary_to_list(Count));
		
		"Markets" ->
			%Category = "Entertainment",
			enutv_util:news_top_text_news_with_limit("us_markets",binary_to_list(Count));

		"Money" ->
			%Category = "Entertainment",
			enutv_util:news_top_text_news_with_limit("us_money",binary_to_list(Count));
		_ ->
			%Category = "None",
			lager:info("#########################None")

	end,

	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Body = list_to_binary(Res),
	{Body, Req, State}.

